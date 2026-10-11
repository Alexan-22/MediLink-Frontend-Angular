import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../core/models/login-request.model';
import { RegisterRequest } from '../core/models/register-request.model';
import { AuthResponse } from '../core/models/auth-response.model';
import { TokenService } from '../core/services/token.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  constructor(private http: HttpClient, private tokenService: TokenService) { }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        if (response.token) {

  this.tokenService.setToken(
    response.token
  );

  localStorage.setItem(
    'username',
    response.username || request.username
  );

  localStorage.setItem(
    'role',
    response.role || ''
  );

  localStorage.setItem(
    'isLoggedIn',
    'true'
  );
}
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true' && !!this.tokenService.getToken();
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getRole(): string | null {

  return localStorage.getItem(
    'role'
  );
}
}
