import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartItem, CartService } from '../../../core/cart/cart.service';

@Component({
  selector: 'app-cart-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent {
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  readonly items = toSignal(this.cartService.items$, {
    initialValue: [] as CartItem[],
  });

  readonly subtotalCents = computed(() => {
    return this.items().reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0,
    );
  });

  changeQuantity(id: string, change: number): void {
    this.cartService.changeQuantity(id, change);
  }

  removeItem(id: string): void {
    this.cartService.removeItem(id);
  }

  checkout(): void {
    if (this.items().length === 0) return;

    void this.router.navigate(['/checkout']);
  }
}
