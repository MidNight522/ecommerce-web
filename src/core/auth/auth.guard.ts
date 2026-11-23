import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Inject, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If we have a user, next
  if (authService.isAuthenticated()) {
    return true;
  }

  // If we have only a token, try to take user
  if (authService.token() && !authService.currentUser()) {
    return authService.getMe().pipe(
      map(() => true),
      catchError(() => of(router.createUrlTree(['/login']))),
    );
  }

  // If we don't have anything
  return router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/home']);
  }

  if (authService.token()) {
    return authService.getMe().pipe(
      map(() => router.createUrlTree(['/home'])),
      catchError(() => of(true)),
    );
  }

  return of(true);
};

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.token()) {
    return router.createUrlTree(['/login']);
  }

  return authService.getMe().pipe(
    map(({ user }) =>
      user.role === 'admin' ? true : router.createUrlTree(['/home']),
    ),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
