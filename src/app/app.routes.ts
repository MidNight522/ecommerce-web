import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { authGuard, guestGuard, adminGuard } from '../core/auth/auth.guard';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'account',
    component: AccountPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    component: CartPageComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'pain-guides',
    loadComponent: () =>
      import('./pages/pain-guides-page/pain-guides-page.component').then(
        (m) => m.PainGuidesPageComponent,
      ),
  },
  {
    path: 'community',
    loadComponent: () =>
      import('./pages/community-page/community-page.component').then(
        (m) => m.CommunityPageComponent,
      ),
  },
  {
    path: 'resources',
    loadComponent: () =>
      import('./pages/resources-page/resources-page.component').then(
        (m) => m.ResourcesPageComponent,
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact-page/contact-page.component').then(
        (m) => m.ContactPageComponent,
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./pages/product-page/product-page.component').then(
        (m) => m.ProductPageComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./pages/faq-page/faq-page.component').then(
        (m) => m.FaqPageComponent,
      ),
  },
  {
    path: 'license',
    loadComponent: () =>
      import('./pages/license-page/license-page.component').then(
        (m) => m.LicensePageComponent,
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout-page/checkout-page.component').then(
        (m) => m.CheckoutPageComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin/products',
    loadComponent: () =>
      import('./pages/admin-products-page/admin-products-page.component').then(
        (m) => m.AdminProductsPageComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/products/new',
    loadComponent: () =>
      import('./pages/admin-product-form-page/admin-product-form-page.component').then(
        (m) => m.AdminProductFormPageComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/products/:id/edit',
    loadComponent: () =>
      import('./pages/admin-product-form-page/admin-product-form-page.component').then(
        (m) => m.AdminProductFormPageComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./pages/admin-dashboard-page/admin-dashboard-page.component').then(
        (m) => m.AdminDashboardPageComponent,
      ),
    canActivate: [adminGuard],
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
