import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  id = 0;
  password = '';
  confirmPassword = '';
  guardando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  }

  guardar(): void {
    if (this.guardando) return;

    if (!Number.isInteger(this.id) || this.id <= 0) {
      alert('El identificador del usuario no es válido');
      return;
    }

    if (!this.password.trim() || this.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.guardando = true;

    this.userService.cambiarPassword(this.id, {
      password: this.password
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.password = '';
        this.confirmPassword = '';
        alert('Contraseña actualizada');
        this.router.navigate(['/users']);
      },
      error: err => {
        this.guardando = false;
        const mensaje = err.error?.mensaje || err.error?.message;
        alert(typeof mensaje === 'string'
          ? mensaje
          : 'No se pudo actualizar la contraseña');
      }
    });
  }

  cancelar(): void {
    if (!this.guardando) this.router.navigate(['/users']);
  }
}