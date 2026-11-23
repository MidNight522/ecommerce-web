import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { ProductsService } from '../../../core/products/products.service';
import { Product } from '../../../core/products/product.types';
import { RouterLink } from '@angular/router';

type SortOption = 'new' | 'price-low' | 'price-high' | 'scoville';

@Component({
  selector: 'app-home-page',
  imports: [AsyncPipe, CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  readonly previewProduct = signal<Product | null>(null);
  private readonly productsService = inject(ProductsService);

  readonly page = signal(1);
  readonly pageSize = 12;

  getPageCount(totalItems: number): number {
    return Math.ceil(totalItems / this.pageSize);
  }

  getPageNumbers(totalPages: number): number[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const current = this.page();

    return [...new Set([1, current - 1, current, current + 1, totalPages])]
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b);
  }

  readonly productsState$ = this.productsService.getProducts().pipe(
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

  readonly search = signal('');
  readonly selectedTypes = signal<string[]>([]);
  readonly selectedLevels = signal<string[]>([]);
  readonly sort = signal<SortOption>('new');

  readonly productTypes = [
    'Whole Chilies',
    'Ground Spices',
    'Scorching Sauces',
    'Sadistic Blends',
    'Infernal Extracts',
  ];

  readonly heatLevels = [
    'Warming Up',
    'Serious Heat',
    'Ring of Fire',
    'Legal Weapon',
  ];

  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'new', label: 'New' },
    { value: 'price-low', label: 'Price Low' },
    { value: 'price-high', label: 'Price High' },
    { value: 'scoville', label: 'Scoville Rating' },
  ];

  toggleFilter(group: 'type' | 'level', value: string): void {
    const selection =
      group === 'type' ? this.selectedTypes : this.selectedLevels;

    selection.update((values) =>
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );

    this.page.set(1);
  }

  private getHeatLevel(scoville: number): string {
    if (scoville < 10000) return 'Warming Up';
    if (scoville < 100000) return 'Serious Heat';
    if (scoville < 500000) return 'Ring of Fire';
    return 'Legal Weapon';
  }

  filterProducts(products: Product[]): Product[] {
    const query = this.search().trim().toLowerCase();
    const types = this.selectedTypes();
    const levels = this.selectedLevels();

    const filtered = products.filter((product) => {
      const text = `${product.name} ${product.description ?? ''}`.toLowerCase();
      const type = product.product_type ?? 'Scorching Sauces';

      return (
        text.includes(query) &&
        (types.length === 0 || types.includes(type)) &&
        (levels.length === 0 ||
          (product.scoville !== null &&
            levels.includes(this.getHeatLevel(product.scoville))))
      );
    });

    return filtered.sort((a, b) => {
      switch (this.sort()) {
        case 'price-low':
          return Number(a.price) - Number(b.price);
        case 'price-high':
          return Number(b.price) - Number(a.price);
        case 'scoville':
          return (b.scoville ?? -1) - (a.scoville ?? -1);
        default:
          return Date.parse(b.created_at) - Date.parse(a.created_at);
      }
    });
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.onerror = null;
    image.src = 'base-logo.svg';
  }
}
