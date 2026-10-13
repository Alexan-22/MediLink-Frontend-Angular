import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioRequest } from '../../../../core/models/usuario-request.model';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  esEdicion = false;
  id = 0;
  cargando = false;
  guardando = false;
  mostrarPassword = false;
  errorMessage = '';
  errorCarga = false;

  usuario: UsuarioRequest = {
    username: '',
    password: '',
    rol: 'MEDICO'
  };

  roles = ['ADMIN', 'RECEPCIONISTA', 'MEDICO', 'ENFERMERA', 'PACIENTE'];

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.esEdicion = true;
    this.id = Number(id);

    if (!Number.isInteger(this.id) || this.id <= 0) {
      this.errorCarga = true;
      this.errorMessage = 'El identificador del usuario no es válido.';
      return;
    }

    this.cargando = true;
    this.userService.buscar(this.id).subscribe({
      next: usuario => {
        this.cargando = false;

        if (!usuario) {
          this.errorCarga = true;
          this.errorMessage = 'No se encontró el usuario.';
          return;
        }

        this.usuario = {
          username: usuario.username,
          password: '',
          rol: usuario.rol
        };
      },
      error: err => {
        this.cargando = false;
        this.errorCarga = true;
        this.errorMessage = this.obtenerError(
          err, 'No se pudo cargar el usuario.'
        );
      }
    });
  }

  get puedeGuardar(): boolean {
  return !this.cargando && !this.guardando && !this.errorCarga &&
    !!this.usuario.username.trim() &&
    this.roles.includes(this.usuario.rol) &&
    (this.esEdicion || !!this.usuario.password?.trim());
}

  nombreRol(rol: string): string {
    const nombres: Record<string, string> = {
      ADMIN: 'Administrador',
      RECEPCIONISTA: 'Recepcionista',
      MEDICO: 'Médico',
      ENFERMERA: 'Enfermera',
      PACIENTE: 'Paciente'
    };
    return nombres[rol] || rol;
  }

  guardar(): void {
    if (!this.puedeGuardar) {
      if (!this.errorCarga) {
        this.errorMessage = 'Completa los campos obligatorios.';
      }
      return;
    }

    this.guardando = true;
    this.errorMessage = '';

    const datos: UsuarioRequest = {
      ...this.usuario,
      username: this.usuario.username.trim()
    };

    const solicitud = this.esEdicion
      ? this.userService.actualizar(this.id, datos)
      : this.userService.guardar(datos);

    solicitud.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/users']);
      },
      error: err => {
        this.guardando = false;
        this.errorMessage = this.obtenerError(
          err, 'No se pudo guardar el usuario.'
        );
      }
    });
  }

  cancelar(): void {
    if (!this.guardando) this.router.navigate(['/users']);
  }

  private obtenerError(err: any, texto: string): string {
    const mensaje = err.error?.mensaje || err.error?.message;
    return typeof mensaje === 'string' && mensaje.trim()
      ? mensaje
      : texto;
  }
}