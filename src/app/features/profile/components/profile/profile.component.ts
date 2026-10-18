import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { PatientService } from '../../../../services/patient.service';
import { DoctorService } from '../../../../services/doctor.service';
import { Paciente } from '../../../../core/models/paciente.model';
import { Medico } from '../../../../core/models/medico.model';

type DatosPerfil = Omit<Paciente, 'id' | 'usuarioId' | 'estado' | 'fechaRegistro'>;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  paciente: Paciente | null = null;
  medico: Medico | null = null;
  cargando = false;
  guardando = false;
  sinPerfil = false;
  errorMessage = '';
  successMessage = '';
  hoy = this.fechaLocal();

  datos: DatosPerfil = {
    dni: '', nombres: '', apellidos: '', fechaNacimiento: '',
    sexo: '', telefono: '', email: '', direccion: '',
    tipoSangre: '', alergias: ''
  };

  tiposSangre = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(
    public authService: AuthService,
    private patientService: PatientService,
    private doctorService: DoctorService
  ) {}

  get role(): string {
    return this.authService.getRole() || '';
  }

  get username(): string {
    return this.authService.getUsername() || 'Usuario';
  }

  get esPaciente(): boolean {
    return this.role === 'PACIENTE';
  }

  get esMedico(): boolean {
    return this.role === 'MEDICO';
  }

  get nombreRol(): string {
    const nombres: Record<string, string> = {
      ADMIN: 'Administrador',
      MEDICO: 'Médico',
      PACIENTE: 'Paciente',
      RECEPCIONISTA: 'Recepcionista',
      ENFERMERA: 'Enfermera'
    };
    return nombres[this.role] || 'Usuario';
  }

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    if (this.cargando || this.guardando) return;
    if (!this.esPaciente && !this.esMedico) return;

    this.cargando = true;
    this.sinPerfil = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.paciente = null;
    this.medico = null;

    if (this.esMedico) {
      this.doctorService.miPerfil().subscribe({
        next: medico => {
          this.medico = medico;
          this.cargando = false;
          if (!medico) this.errorMessage = 'No se encontró tu ficha médica.';
        },
        error: (err: HttpErrorResponse) => this.manejarErrorCarga(err)
      });
      return;
    }

    this.patientService.miPerfil().subscribe({
      next: paciente => {
        this.paciente = paciente;
        this.cargando = false;
        if (!paciente) this.errorMessage = 'No se encontró tu ficha de paciente.';
      },
      error: (err: HttpErrorResponse) => this.manejarErrorCarga(err)
    });
  }

  guardar(): void {
    if (!this.esPaciente || !this.sinPerfil || this.guardando || this.cargando) return;

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
        this.successMessage = 'Tu ficha se creó y vinculó correctamente.';
      },
      error: (err: HttpErrorResponse) => {
        this.guardando = false;
        this.errorMessage = this.obtenerError(
          err, 'No se pudieron guardar tus datos. Intenta nuevamente.'
        );
      }
    });
  }

  private manejarErrorCarga(err: HttpErrorResponse): void {
    this.cargando = false;

    if (err.status === 404) {
      this.sinPerfil = true;
      return;
    }

    this.errorMessage = this.obtenerError(
      err, 'No se pudo cargar tu perfil. Intenta nuevamente.'
    );
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