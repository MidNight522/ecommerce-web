import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

export interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  payment_method: string | null;
  payment_status: string;
}

export interface CreateOrderBody {
  requestId: string;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
  paymentMethod: 'card' | 'wallet' | 'cash';
  expectedTotalCents: number;
  items: { id: string; quantity: number }[];
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);

  createOrder(body: CreateOrderBody) {
    return this.http.post<{ order: Order }>(
      `${environment.apiUrl}/orders`,
      body,
    );
  }

  getMyOrders(page: number, pageSize: number) {
    return this.http.get<{ data: Order[]; count: number }>(
      `${environment.apiUrl}/orders`,
      { params: { page, pageSize } },
    );
  }
}
