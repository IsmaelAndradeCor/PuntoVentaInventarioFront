import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 400) {
        const errors = error.error?.errors;

        if (errors) {
          Object.keys(errors).forEach(key => {
            const mensajes = errors[key];
            if (Array.isArray(mensajes)) {
              mensajes.forEach((msg: string) => toastr.error(msg));
            }
          });
        } else if (error.error?.mensaje) {
          toastr.error(error.error.mensaje);
        } else {
          toastr.error('Solicitud inválida.');
        }
      }

      else if (error.status === 401) {
        if (error.error?.mensaje) {
          toastr.error(error.error.mensaje);
        } else {
          toastr.error('No autorizado.');
        }
      }

      else if (error.status === 403) {
        toastr.error('Acceso denegado.');
      }

      else if (error.status === 404) {
        toastr.error('Recurso no encontrado.');
      }

      else if (error.status === 409) {
        if (error.error?.mensaje) {
          toastr.error(error.error.mensaje);
        } else {
          toastr.error('Error de conflicto en la base de datos.');
        }
      }

      else if (error.status === 500) {
        toastr.error('Error interno del servidor.');
      }

      else if (error.status === 0) {
        toastr.error('No se pudo conectar con el servidor.');
      }

      return throwError(() => error);
    })
  );
};