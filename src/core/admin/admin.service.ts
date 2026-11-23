import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

export interface DashboardStats {
  totalSales: number;
  totalUsers: number;
  totalOrders: number;
  totalPending: number;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getDashboard() {
    return this.http.get<{ data: DashboardStats }>(
      `${environment.apiUrl}/admin/dashboard`,
    );
  }
}
