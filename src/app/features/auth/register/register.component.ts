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
  registerData: RegisterRequest = {
    username: '',
    password: '',
    rol: 'PACIENTE'
  };

  confirmPassword = '';
  guardando = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.guardando || this.successMessage) return;

    this.errorMessage = '';

    if (!this.registerData.username.trim()) {
      this.errorMessage = 'Ingresa un usuario.';
      return;
    }

    if (!this.registerData.password.trim() || this.registerData.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    if (new TextEncoder().encode(this.registerData.password).length > 72) {
      this.errorMessage = 'La contraseña es demasiado larga.';
      return;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const datos: RegisterRequest = {
      username: this.registerData.username.trim(),
      password: this.registerData.password,
      rol: 'PACIENTE'
    };

    this.guardando = true;

    this.authService.register(datos).subscribe({
      next: response => {
        this.guardando = false;

        // El backend actual puede devolver HTTP 200 aunque el usuario exista.
        if (response.mensaje !== 'Usuario registrado correctamente') {
          this.errorMessage = response.mensaje || 'No se pudo registrar la cuenta.';
          return;
        }

        this.successMessage = 'Cuenta creada. Ya puedes iniciar sesión.';
        this.registerData.password = '';
        this.confirmPassword = '';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: err => {
        this.guardando = false;
        const mensaje = err.error?.mensaje || err.error?.message;
        this.errorMessage = typeof mensaje === 'string'
          ? mensaje
          : 'No se pudo registrar la cuenta. Intenta nuevamente.';
      }
    });
  }
}
