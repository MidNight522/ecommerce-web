import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, finalize, map, of, switchMap } from 'rxjs';
import { ProductsService } from '../../../core/products/products.service';
import { ProductWriteBody } from '../../../core/products/product.types';

@Component({
  selector: 'app-admin-product-form-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-product-form-page.component.html',
  styleUrl: './admin-product-form-page.component.scss',
})
export class AdminProductFormPageComponent {
  private readonly productsService = inject(ProductsService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly messages = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly productId = signal<string | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly loadError = signal(false);
  readonly isHidden = signal(false);

  readonly categories = [
    'Whole Chilies',
    'Ground Spices',
    'Scorching Sauces',
    'Sadistic Blends',
    'Infernal Extracts',
  ];

  readonly productForm = this.formBuilder.group({
    name: [
      '',
      [
        Validators.required,
        Validators.pattern(/\S/),
        Validators.maxLength(500),
      ],
    ],
    description: ['', Validators.maxLength(10000)],
    price: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(9999999999.99),
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
    ]),
    stock: this.formBuilder.control<number | null>(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(2147483647),
      Validators.pattern(/^\d+$/),
    ]),
    scoville: this.formBuilder.control<number | null>(null, [
      Validators.min(0),
      Validators.max(2147483647),
      Validators.pattern(/^\d+$/),
    ]),
    product_type: [''],
    image_url: [
      '',
      [Validators.maxLength(2000), Validators.pattern(/^https?:\/\/\S+$/)],
    ],
  });

  constructor() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');

          this.productId.set(id);
          this.loadError.set(false);
          this.loading.set(Boolean(id));

          if (!id) return of(null);

          return this.productsService.getAdminProduct(id).pipe(
            map((response) => response.data),
            catchError(() => {
              this.loadError.set(true);
              return of(null);
            }),
            finalize(() => this.loading.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((product) => {
        this.isHidden.set(product?.is_hidden ?? false);
        this.productForm.reset({
          name: product?.name ?? '',
          description: product?.description ?? '',
          price: product ? Number(product.price) : null,
          stock: product?.stock ?? 0,
          scoville: product?.scoville ?? null,
          product_type: product?.product_type ?? '',
          image_url: product?.image_url ?? '',
        });
      });
  }

  save(): void {
    if (this.loading() || this.saving() || this.loadError()) return;

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const value = this.productForm.getRawValue();

    if (value.price === null || value.stock === null) return;

    const body: ProductWriteBody = {
      name: value.name.trim(),
      description: value.description.trim() || null,
      price: value.price,
      stock: value.stock,
      scoville: value.scoville,
      product_type: value.product_type || null,
      image_url: value.image_url.trim() || null,
    };

    const id = this.productId();
    const request$ = id
      ? this.productsService.updateProduct(id, body)
      : this.productsService.createProduct(body);

    this.saving.set(true);

    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: () => {
          this.messages.add({
            severity: 'success',
            summary: 'Saved',
            detail: id ? 'Product updated.' : 'Product created.',
          });

          void this.router.navigate(['/admin/products']);
        },
        error: () => {
          //apiInterceptor.
        },
      });
  }
  toggleVisibility(): void {
    const id = this.productId();

    if (!id || this.saving() || this.loading() || this.loadError()) return;

    const nextHidden = !this.isHidden();
    this.saving.set(true);

    this.productsService
      .setVisibility(id, nextHidden)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: ({ product }) => {
          this.isHidden.set(product.is_hidden ?? false);

          this.messages.add({
            severity: 'success',
            summary: nextHidden ? 'Product hidden' : 'Product visible',
            detail: nextHidden
              ? 'The product has been removed from the catalog.'
              : 'The product is available in the catalog again.',
          });
        },
        error: () => {
          // Сообщение показывает apiInterceptor.
        },
      });
  }

  deleteProduct(): void {
    const id = this.productId();

    if (!id || this.saving() || this.loading() || this.loadError()) return;

    const confirmed = window.confirm(
      'Permanently delete this product? This action cannot be undone.',
    );

    if (!confirmed) return;

    this.saving.set(true);

    this.productsService
      .deleteProduct(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: () => {
          this.messages.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'The product has been deleted.',
          });

          void this.router.navigate(['/admin/products']);
        },
        error: () => {
          //apiInterceptor.
        },
      });
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;
    const fallback = new URL('base-logo.svg', image.baseURI).href;

    if (image.src !== fallback) image.src = fallback;
  }
}
