import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DoctorService } from '../../../services/doctor.service';
import { Medico } from '../../../core/models/medico.model';
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
  private id = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private toast: ToastService
  ) {}

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
      },
      error: () => {
        this.cargando = false;
        this.errorCarga = true;
        this.error = 'No se pudo cargar el médico.';
      }
    });
  }

  guardar(form: NgForm): void {
    if (this.cargando || this.guardando || this.errorCarga) return;

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
        const mensaje = err.error?.mensaje || err.error?.message;
        this.error = typeof mensaje === 'string'
          ? mensaje
          : 'No se pudo guardar el médico. Revisa que el CMP no esté repetido.';
      }
    });
  }

  cancelar(): void {
    if (!this.guardando) this.router.navigate(['/doctors']);
  }
}
