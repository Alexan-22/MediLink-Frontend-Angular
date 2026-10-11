import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../core/models/register-request.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerData: RegisterRequest = { username: '', password: '', rol: 'PACIENTE' };
  successMessage = '';
  errorMessage = '';
  constructor(private authService: AuthService, private router: Router) { }
  onSubmit(): void {
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.successMessage = response.mensaje;
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => this.errorMessage = err.error?.mensaje || 'Error al registrar'
    });
  }
}
