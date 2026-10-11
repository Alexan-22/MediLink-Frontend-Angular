import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../core/models/login-request.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData: LoginRequest = { username: '', password: '' };
  errorMessage = '';
  constructor(private authService: AuthService, private router: Router) { }
  onSubmit(): void {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        if (response.token) this.router.navigate(['/dashboard']);
        else this.errorMessage = response.mensaje || 'Error en login';
      },
      error: (err) => this.errorMessage = err.error?.mensaje || 'Error al conectar'
    });
  }
}
