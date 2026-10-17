import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { PatientService } from '../../../../services/patient.service';
import { Paciente } from '../../../../core/models/paciente.model';

type DatosPerfil = Omit<Paciente, 'id' | 'usuarioId' | 'estado' | 'fechaRegistro'>;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  paciente: Paciente | null = null;
  cargando = false;
  guardando = false;
  sinPerfil = false;
  errorMessage = '';
  successMessage = '';
  hoy = this.fechaLocal();

  datos: DatosPerfil = {
    dni: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    sexo: '',
    telefono: '',
    email: '',
    direccion: '',
    tipoSangre: '',
    alergias: ''
  };

  tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(
    public authService: AuthService,
    private patientService: PatientService,
    private router: Router
  ) {}

  get esPaciente(): boolean {
    return this.authService.getRole() === 'PACIENTE';
  }

  ngOnInit(): void {
    if (this.esPaciente) this.cargarPerfil();
  }

  cargarPerfil(): void {
    if (this.cargando || this.guardando) return;

    this.cargando = true;
    this.sinPerfil = false;
    this.errorMessage = '';

    this.patientService.miPerfil().subscribe({
      next: paciente => {
        this.paciente = paciente;
        this.cargando = false;
      },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;

        if (err.status === 404) {
          this.paciente = null;
          this.sinPerfil = true;
          return;
        }

        this.errorMessage = this.obtenerError(
          err, 'No se pudo cargar tu perfil. Intenta nuevamente.'
        );
      }
    });
  }

  guardar(): void {
    if (!this.esPaciente || !this.sinPerfil || this.guardando) return;

    this.errorMessage = '';
    this.successMessage = '';

    const datos: DatosPerfil = {
      dni: this.datos.dni.trim(),
      nombres: this.datos.nombres.trim(),
      apellidos: this.datos.apellidos.trim(),
      fechaNacimiento: this.datos.fechaNacimiento,
      sexo: this.datos.sexo,
      telefono: this.datos.telefono.trim(),
      email: this.datos.email.trim(),
      direccion: this.datos.direccion.trim(),
      tipoSangre: this.datos.tipoSangre,
      alergias: this.datos.alergias.trim()
    };

    if (!/^[0-9]{8}$/.test(datos.dni)) {
      this.errorMessage = 'El DNI debe tener 8 dígitos.';
      return;
    }

    if (!datos.nombres || !datos.apellidos) {
      this.errorMessage = 'Ingresa tus nombres y apellidos.';
      return;
    }

    if (!datos.fechaNacimiento || datos.fechaNacimiento > this.hoy) {
      this.errorMessage = 'Ingresa una fecha de nacimiento válida.';
      return;
    }

    if (!['M', 'F'].includes(datos.sexo)) {
      this.errorMessage = 'Selecciona tu sexo.';
      return;
    }

    if (datos.telefono && !/^[0-9]{9}$/.test(datos.telefono)) {
      this.errorMessage = 'El teléfono debe tener 9 dígitos.';
      return;
    }

    if (datos.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
      this.errorMessage = 'Ingresa un correo válido.';
      return;
    }

    this.guardando = true;

    this.patientService.crearMiPerfil(datos).subscribe({
      next: paciente => {
        this.paciente = paciente;
        this.sinPerfil = false;
        this.guardando = false;
        this.successMessage = 'Tu ficha de paciente se creó y vinculó correctamente.';
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        this.errorMessage = this.obtenerError(
          err, 'No se pudieron guardar tus datos. Intenta nuevamente.'
        );
      }
    });
  }

  logout(): void {
    if (this.guardando) return;
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private obtenerError(err: HttpErrorResponse, texto: string): string {
    const mensaje = err.error?.mensaje || err.error?.message;
    return typeof mensaje === 'string' && mensaje.trim() ? mensaje : texto;
  }

  private fechaLocal(): string {
    const fecha = new Date();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }
}