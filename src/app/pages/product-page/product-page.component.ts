import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { ProductsService } from '../../../core/products/products.service';
import { CartService } from '../../../core/cart/cart.service';
import { Product } from '../../../core/products/product.types';

@Component({
  selector: 'app-product-page',
  imports: [AsyncPipe, CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent {
  readonly reviews = [
    {
      id: 1,
      rating: 5,
      stars: '★★★★★',
      title: 'This is the real deal!',
      text: 'A little goes a long way. Great flavour and a lasting heat. Perfect for adding a kick to homemade sauces.',
      author: 'ChilliHead_27',
      initials: 'CH',
    },
    {
      id: 2,
      rating: 4,
      stars: '★★★★☆',
      title: 'Painfully Delicious',
      text: 'Rich flavour with a serious punch. I tried it with chicken and rice. Start small and build up!',
      author: 'SpiceMasochist',
      initials: 'SM',
    },
    {
      id: 3,
      rating: 1,
      stars: '★☆☆☆☆',
      title: "I've Made A Huge Mistake",
      text: 'I underestimated the heat and added far too much. Definitely a product for experienced chilli fans.',
      author: 'RegretfulRookie',
      initials: 'RR',
    },
  ];

  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly messages = inject(MessageService);

  readonly productState$ = this.route.paramMap.pipe(
    switchMap((params) =>
      this.productsService.getProduct(params.get('id') ?? '').pipe(
        map((response) => ({
          product: response.data,
          error: false,
        })),
        catchError(() => of({ product: null, error: true })),
        startWith({ product: null, error: false }),
      ),
    ),
  );

  addToCart(product: Product): void {
    const added = this.cartService.addProduct(product);

    this.messages.add({
      severity: added ? 'success' : 'warn',
      summary: added ? 'Added to cart' : 'Stock limit reached',
      detail: added
        ? product.name
        : 'All available units are already in your cart.',
    });
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    const fallback = new URL('base-logo.svg', image.baseURI).href;

    if (image.src !== fallback) {
      image.src = fallback;
    }
  }
}
