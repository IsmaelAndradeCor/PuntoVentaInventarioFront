import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const isLoginRequest = req.url.toLowerCase().includes('/auth/login');

  if (isLoginRequest) {
    return next(req);
  }

  if (authService.forceLogoutIfExpired()) {
    return throwError(() => new Error('La sesión ha expirado.'));
  }

  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.handleUnauthorized();
      }

      return throwError(() => error);
    })
  );
};