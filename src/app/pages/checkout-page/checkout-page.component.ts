import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { AuthService } from '../../../core/auth/auth.service';
import { CartItem, CartService } from '../../../core/cart/cart.service';
import { OrdersService } from '../../../core/orders/orders.service';
import { finalize } from 'rxjs';

type PaymentMethod = 'card' | 'wallet' | 'cash';

@Component({
  selector: 'app-checkout-page',
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    RouterLink,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
})
export class CheckoutPageComponent {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly messages = inject(MessageService);
  private readonly ordersService = inject(OrdersService);
  private readonly router = inject(Router);
  private readonly requestId = crypto.randomUUID();

  readonly saving = signal(false);

  readonly items = toSignal(this.cartService.items$, {
    initialValue: [] as CartItem[],
  });

  readonly totalCents = computed(() =>
    this.items().reduce(
      (total, item) => total + item.priceCents * item.quantity,
      0,
    ),
  );

  readonly paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'card', label: 'Debit Card' },
    { value: 'wallet', label: 'Digital Wallet' },
    { value: 'cash', label: 'Cash On Delivery' },
  ];

  readonly checkoutForm = this.formBuilder.group({
    name: [
      this.authService.currentUser()?.name ?? '',
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(200),
      ],
    ],
    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\+?[0-9](?:[ ()-]*[0-9]){6,14}$/),
        Validators.maxLength(40),
      ],
    ],
    city: [
      '',
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(100),
      ],
    ],
    address: [
      '',
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(500),
      ],
    ],
    paymentMethod: this.formBuilder.control<PaymentMethod>(
      'card',
      Validators.required,
    ),
  });

  onSubmit(): void {
    if (this.saving()) return;

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const items = this.items().map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    if (items.length === 0) return;

    const { paymentMethod, ...customer } = this.checkoutForm.getRawValue();

    this.saving.set(true);

    this.ordersService
      .createOrder({
        requestId: this.requestId,
        customer,
        paymentMethod,
        expectedTotalCents: this.totalCents(),
        items,
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: ({ order }) => {
          this.cartService.removePurchasedItems(items);

          this.messages.add({
            severity: 'success',
            summary: 'Order placed',
            detail: `Order #${order.id.slice(0, 8)} is awaiting processing.`,
          });

          void this.router.navigate(['/account']);
        },
        error: () => {
          // Сообщение показывает apiInterceptor. Корзина сохраняется.
        },
      });
  }
}
