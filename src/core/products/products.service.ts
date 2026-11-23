import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import {
  ProductResponse,
  ProductsResponse,
  ProductWriteBody,
  ProductWriteResponse,
} from './product.types';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);

  getProducts() {
    return this.http.get<ProductsResponse>(`${environment.apiUrl}/products`);
  }

  getProduct(id: string) {
    return this.http.get<ProductResponse>(
      `${environment.apiUrl}/products/${encodeURIComponent(id)}`,
    );
  }

  createProduct(body: ProductWriteBody) {
    return this.http.post<ProductWriteResponse>(
      `${environment.apiUrl}/products`,
      body,
    );
  }

  updateProduct(id: string, body: ProductWriteBody) {
    return this.http.put<ProductWriteResponse>(
      `${environment.apiUrl}/products/${encodeURIComponent(id)}`,
      body,
    );
  }

  getAdminProducts() {
    return this.http.get<ProductsResponse>(
      `${environment.apiUrl}/products/admin`,
    );
  }

  getAdminProduct(id: string) {
    return this.http.get<ProductResponse>(
      `${environment.apiUrl}/products/admin/${encodeURIComponent(id)}`,
    );
  }

  setVisibility(id: string, isHidden: boolean) {
    return this.http.patch<ProductWriteResponse>(
      `${environment.apiUrl}/products/${encodeURIComponent(id)}/visibility`,
      { is_hidden: isHidden },
    );
  }

  deleteProduct(id: string) {
    return this.http.delete<void>(
      `${environment.apiUrl}/products/${encodeURIComponent(id)}`,
    );
  }
}
