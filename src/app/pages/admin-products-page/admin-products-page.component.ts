import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../../core/products/products.service';
import { Product } from '../../../core/products/product.types';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-admin-products-page',
  imports: [AsyncPipe, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './admin-products-page.component.html',
  styleUrl: './admin-products-page.component.scss',
})
export class AdminProductsPageComponent {
  private readonly productsService = inject(ProductsService);

  readonly page = signal(1);
  readonly pageSize = 8;

  readonly productsState$ = this.productsService.getAdminProducts().pipe(
    map((response) => ({
      products: response.data,
      error: false,
    })),
    catchError(() =>
      of({
        products: [] as Product[],
        error: true,
      }),
    ),
  );

  getPageCount(total: number): number {
    return Math.ceil(total / this.pageSize);
  }

  getPageNumbers(total: number): number[] {
    return Array.from(
      { length: this.getPageCount(total) },
      (_, index) => index + 1,
    );
  }
}
