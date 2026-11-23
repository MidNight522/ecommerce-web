import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AdminService } from '../../../core/admin/admin.service';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [AsyncPipe, CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrl: './admin-dashboard-page.component.scss',
})
export class AdminDashboardPageComponent {
  private readonly adminService = inject(AdminService);

  readonly dashboardState$ = this.adminService.getDashboard().pipe(
    map(({ data }) => ({
      error: false,
      cards: [
        {
          title: 'Total Sales',
          value: data.totalSales,
          money: true,
          icon: 'pi pi-chart-line',
          color: 'green',
          caption: 'Confirmed, shipped and delivered orders',
        },
        {
          title: 'Total Users',
          value: data.totalUsers,
          money: false,
          icon: 'pi pi-users',
          color: 'purple',
          caption: 'Registered accounts',
        },
        {
          title: 'Total Orders',
          value: data.totalOrders,
          money: false,
          icon: 'pi pi-box',
          color: 'yellow',
          caption: 'All orders',
        },
        {
          title: 'Total Pending',
          value: data.totalPending,
          money: false,
          icon: 'pi pi-clock',
          color: 'orange',
          caption: 'New and pending orders',
        },
      ],
    })),
    catchError(() =>
      of({
        error: true,
        cards: [],
      }),
    ),
  );
}
