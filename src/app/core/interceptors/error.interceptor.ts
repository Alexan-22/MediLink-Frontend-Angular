import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastService: ToastService, private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = 'Ocurrió un error';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          errorMsg = error.error?.mensaje || `Error ${error.status}: ${error.message}`;
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            errorMsg = 'Sesión expirada, inicia sesión nuevamente';
          }
        }
        this.toastService.show(errorMsg, 'error');
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
