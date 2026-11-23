import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../products/product.types';

export interface CartItem {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl: string;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);

  readonly items$ = this.itemsSubject.asObservable();

  addProduct(product: Product): boolean {
    const items = this.itemsSubject.value;
    const existing = items.find((item) => item.id === product.id);

    if ((existing?.quantity ?? 0) >= product.stock) {
      return false;
    }

    if (existing) {
      this.itemsSubject.next(
        items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, stock: product.stock }
            : item,
        ),
      );
    } else {
      this.itemsSubject.next([
        ...items,
        {
          id: product.id,
          name: product.name,
          priceCents: Math.round(Number(product.price) * 100),
          quantity: 1,
          imageUrl: product.image_url || 'base-logo.svg',
          stock: product.stock,
        },
      ]);
    }

    return true;
  }

  changeQuantity(id: string, change: number): void {
    this.itemsSubject.next(
      this.itemsSubject.value.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(
                item.stock,
                Math.max(1, item.quantity + change),
              ),
            }
          : item,
      ),
    );
  }

  removeItem(id: string): void {
    this.itemsSubject.next(
      this.itemsSubject.value.filter((item) => item.id !== id),
    );
  }

  removePurchasedItems(purchased: { id: string; quantity: number }[]): void {
    const quantities = new Map(
      purchased.map((item) => [item.id, item.quantity]),
    );

    this.itemsSubject.next(
      this.itemsSubject.value
        .map((item) => {
          const bought = quantities.get(item.id) ?? 0;
          const stock = Math.max(0, item.stock - bought);

          return {
            ...item,
            stock,
            quantity: Math.min(stock, Math.max(0, item.quantity - bought)),
          };
        })
        .filter((item) => item.quantity > 0),
    );
  }
}
