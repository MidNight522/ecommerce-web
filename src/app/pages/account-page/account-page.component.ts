import { Component, computed, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../../core/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { catchError, finalize, map, of, startWith, switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Order, OrdersService } from '../../../core/orders/orders.service';

@Component({
  selector: 'app-account-page',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    CurrencyPipe,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './account-page.component.html',
  styleUrl: './account-page.component.scss',
})
export class AccountPageComponent {
  private readonly messages = inject(MessageService);
  readonly saving = signal(false);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly user = this.authService.currentUser();
  private readonly ordersService = inject(OrdersService);
  readonly isAdmin = computed(
    () => this.authService.currentUser()?.role === 'admin',
  );

  readonly accountForm = this.formBuilder.group({
    name: [this.user?.name ?? '', Validators.maxLength(200)],
    phone: [
      this.user?.phone ?? '',
      [
        Validators.maxLength(40),
        Validators.pattern(/^\+?[0-9](?:[ ()-]*[0-9]){6,14}$/),
      ],
    ],
    email: [
      this.user?.email ?? '',
      [Validators.required, Validators.email, Validators.maxLength(300)],
    ],
    city: [this.user?.city ?? '', Validators.maxLength(100)],
    shippingAddress: [
      this.user?.shippingAddress ?? '',
      Validators.maxLength(500),
    ],
  });

  private savedProfile = this.accountForm.getRawValue();

  hasChanges(): boolean {
    return (
      JSON.stringify(this.accountForm.getRawValue()) !==
      JSON.stringify(this.savedProfile)
    );
  }

  saveProfile(): void {
    if (this.saving() || !this.hasChanges()) return;

    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    this.authService
      .updateProfile(this.accountForm.getRawValue())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: ({ user }) => {
          const saved = {
            name: user.name ?? '',
            phone: user.phone ?? '',
            email: user.email,
            city: user.city ?? '',
            shippingAddress: user.shippingAddress ?? '',
          };

          this.savedProfile = saved;
          this.accountForm.reset(saved);

          this.messages.add({
            severity: 'success',
            summary: 'Saved',
            detail: 'Your profile has been updated.',
          });
        },
        error: () => {
          //apiInterceptor.
        },
      });
  }

  readonly activeTab = signal<'history' | 'info'>('history');
  readonly orderPage = signal(0);
  readonly pageSize = 8;

  readonly history = toSignal(
    toObservable(this.orderPage).pipe(
      switchMap((page) =>
        this.ordersService.getMyOrders(page, this.pageSize).pipe(
          map((response) => ({
            orders: response.data,
            total: response.count,
            loading: false,
            error: false,
          })),
          catchError(() =>
            of({
              orders: [] as Order[],
              total: 0,
              loading: false,
              error: true,
            }),
          ),
          startWith({
            orders: [] as Order[],
            total: 0,
            loading: true,
            error: false,
          }),
        ),
      ),
    ),
    {
      initialValue: {
        orders: [] as Order[],
        total: 0,
        loading: true,
        error: false,
      },
    },
  );

  readonly visibleOrders = computed(() => this.history().orders);

  readonly statusLabels: Record<string, string> = {
    new: 'Pending',
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
