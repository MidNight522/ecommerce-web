import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const messageService = inject(MessageService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        handleHttpError(
          error,
          request.url,
          authService,
          messageService,
          router,
        );
      }
      return throwError(() => error);
    }),
  );
};

function handleHttpError(
  error: HttpErrorResponse,
  requestUrl: string,
  authService: AuthService,
  messageService: MessageService,
  router: Router,
) {
  const isAuthEndpoint =
    requestUrl.includes('/login') || requestUrl.includes('/register');

  if (error.status === 401 && !isAuthEndpoint) {
    authService.logout();
    messageService.add({
      severity: 'warn',
      summary: 'Your session has expired',
      detail: 'Please log in',
    });
    router.navigate(['/login']);
    return;
  } else {
    messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.error?.message ?? 'An unknown error has occurred',
    });
  }
}
