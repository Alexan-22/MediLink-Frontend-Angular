import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const ruta = req.url.split('?')[0].replace(/\/+$/, '');
        const consultaPerfil = req.method === 'GET' &&
          ruta.endsWith('/patients/me');

        // El componente maneja el perfil que todavía no existe.
        if (consultaPerfil && error.status === 404) {
          return throwError(() => error);
        }

        const mensaje = error.error?.mensaje || error.error?.message;
        let errorMsg = typeof mensaje === 'string'
          ? mensaje
          : 'No se pudo procesar la solicitud.';

        if (error.status === 0) {
          errorMsg = 'No se pudo conectar con el servidor.';
        }

        const esLogin = ruta.endsWith('/auth/login');
        const esRegistro = ruta.endsWith('/auth/register');

        if (error.status === 401 && !esLogin && !esRegistro) {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
          errorMsg = 'Sesión expirada, inicia sesión nuevamente';
        }

        this.toastService.show(errorMsg, 'error');

        // Conservar status y respuesta para los componentes.
        return throwError(() => error);
      })
    );
  }
}