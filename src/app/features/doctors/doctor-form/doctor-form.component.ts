import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { DoctorService } from '../../../services/doctor.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Medico } from '../../../core/models/medico.model';
import { Usuario } from '../../../core/models/usuario.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.scss']
})
export class DoctorFormComponent implements OnInit {
  medico: Medico = {
    cmp: '', nombres: '', apellidos: '', especialidad: '',
    telefono: '', email: '', consultorio: '',
    horarioInicio: '08:00', horarioFin: '17:00', estado: 'ACTIVO'
  };

  esEdicion = false;
  cargando = false;
  guardando = false;
  errorCarga = false;
  error = '';

  usuariosMedicos: Usuario[] = [];
  usuarioSeleccionado: number | null = null;
  cargandoCuentas = false;
  vinculando = false;
  errorVinculo = '';
  mensajeVinculo = '';

  private id = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private userService: UserService,
    public authService: AuthService,
    private toast: ToastService
  ) {}

  get esAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  get cuentaVinculada(): boolean {
    return this.medico.usuarioId != null;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.esEdicion = true;
    this.id = Number(id);

    if (!Number.isInteger(this.id) || this.id <= 0) {
      this.errorCarga = true;
      this.error = 'El identificador del médico no es válido.';
      return;
    }

    this.cargando = true;

    this.doctorService.buscarPorId(this.id).subscribe({
      next: data => {
        this.cargando = false;

        if (!data) {
          this.errorCarga = true;
          this.error = 'No se encontró el médico.';
          return;
        }

        this.medico = {
          ...data,
          telefono: data.telefono || '',
          email: data.email || '',
          consultorio: data.consultorio || '',
          horarioInicio: data.horarioInicio || '',
          horarioFin: data.horarioFin || ''
        };

        this.usuarioSeleccionado = data.usuarioId ?? null;

        if (this.esAdmin && !this.cuentaVinculada) {
          this.cargarCuentas();
        }
      },
      error: err => {
        this.cargando = false;
        this.errorCarga = true;
        this.error = this.obtenerError(err, 'No se pudo cargar el médico.');
      }
    });
  }

  cargarCuentas(): void {
    if (!this.esAdmin || this.cargandoCuentas || this.cuentaVinculada) return;

    this.cargandoCuentas = true;
    this.errorVinculo = '';

    forkJoin({
      usuarios: this.userService.listar(),
      medicos: this.doctorService.listar()
    }).subscribe({
      next: ({ usuarios, medicos }) => {
        const ocupados = new Set(
          medicos
            .filter(m => m.usuarioId != null)
            .map(m => m.usuarioId)
        );

        this.usuariosMedicos = usuarios.filter(usuario =>
          usuario.rol === 'MEDICO' &&
          usuario.id != null &&
          !ocupados.has(usuario.id)
        );

        this.cargandoCuentas = false;
      },
      error: err => {
        this.cargandoCuentas = false;
        this.errorVinculo = this.obtenerError(
          err, 'No se pudieron cargar las cuentas médicas.'
        );
      }
    });
  }

  vincularCuenta(): void {
    if (!this.esAdmin || !this.esEdicion || this.errorCarga ||
        this.cargando || this.guardando || this.vinculando ||
        this.cargandoCuentas || this.cuentaVinculada) return;

    const usuarioId = this.usuarioSeleccionado;

    if (usuarioId == null ||
        !this.usuariosMedicos.some(usuario => usuario.id === usuarioId)) {
      this.errorVinculo = 'Selecciona una cuenta médica disponible.';
      return;
    }

    this.errorVinculo = '';
    this.mensajeVinculo = '';
    this.vinculando = true;

    this.doctorService.vincularUsuario(this.id, usuarioId).subscribe({
      next: medico => {
        // Actualizar solo la vinculación para conservar cambios sin guardar.
        this.medico.usuarioId = medico.usuarioId;
        this.usuarioSeleccionado = medico.usuarioId ?? null;
        this.vinculando = false;
        this.mensajeVinculo = 'La cuenta se vinculó correctamente.';
        this.toast.show('Cuenta médica vinculada', 'success');
      },
      error: err => {
        this.vinculando = false;
        this.errorVinculo = this.obtenerError(
          err, 'No se pudo vincular la cuenta.'
        );
      }
    });
  }

  guardar(form: NgForm): void {
    if (this.cargando || this.guardando || this.vinculando || this.errorCarga) return;

    this.error = '';

    if (form.invalid || !this.medico.cmp.trim() ||
        !this.medico.nombres.trim() || !this.medico.apellidos.trim() ||
        !this.medico.especialidad.trim()) {
      form.control.markAllAsTouched();
      this.error = 'Completa los campos obligatorios y revisa el correo.';
      return;
    }

    if (this.medico.horarioInicio >= this.medico.horarioFin) {
      this.error = 'El horario de fin debe ser posterior al horario de inicio.';
      return;
    }

    const datos: Medico = {
      ...this.medico,
      cmp: this.medico.cmp.trim(),
      nombres: this.medico.nombres.trim(),
      apellidos: this.medico.apellidos.trim(),
      especialidad: this.medico.especialidad.trim(),
      telefono: this.medico.telefono.trim(),
      email: this.medico.email.trim(),
      consultorio: this.medico.consultorio.trim()
    };

    this.guardando = true;

    const solicitud = this.esEdicion
      ? this.doctorService.actualizar(this.id, datos)
      : this.doctorService.guardar(datos);

    solicitud.subscribe({
      next: () => {
        this.guardando = false;
        this.toast.show(
          `Médico ${this.esEdicion ? 'actualizado' : 'creado'}`, 'success'
        );
        this.router.navigate(['/doctors']);
      },
      error: err => {
        this.guardando = false;
        this.error = this.obtenerError(
          err, 'No se pudo guardar el médico. Revisa que el CMP no esté repetido.'
        );
      }
    });
  }

  cancelar(): void {
    if (!this.guardando && !this.vinculando) {
      this.router.navigate(['/doctors']);
    }
  }

  private obtenerError(err: any, texto: string): string {
    const mensaje = err.error?.mensaje || err.error?.message;
    return typeof mensaje === 'string' && mensaje.trim() ? mensaje : texto;
  }
}
