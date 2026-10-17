import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(public authService: AuthService, private router: Router) {}

  get username(): string {
    return this.authService.getUsername() || 'Usuario';
  }

  get role(): string {
    return this.authService.getRole() || '';
  }

  get inicial(): string {
    return this.username.charAt(0).toUpperCase();
  }

  get nombreRol(): string {
    const roles: Record<string, string> = {
      ADMIN: 'Administrador',
      MEDICO: 'Médico',
      PACIENTE: 'Paciente',
      RECEPCIONISTA: 'Recepcionista',
      ENFERMERA: 'Enfermera'
    };
    return roles[this.role] || 'Usuario';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}