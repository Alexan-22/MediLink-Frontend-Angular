import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppointmentService } from '../../../services/appointment.service';
import { PatientService } from '../../../services/patient.service';
import { DoctorService } from '../../../services/doctor.service';
import { ToastService } from '../../../services/toast.service';
import { Cita } from '../../../core/models/cita.model';
import { Paciente } from '../../../core/models/paciente.model';
import { Medico } from '../../../core/models/medico.model';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit, OnDestroy {
  cita: Cita = {
    pacienteId: 0, medicoId: 0, fecha: '', hora: '',
    motivoConsulta: '', observaciones: '', estado: 'PROGRAMADA'
  };

  esEdicion = false;
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  horasDisponibles: string[] = [];
  cargandoHoras = false;
  cargandoCita = false;
  guardando = false;
  errorHoras = '';
  errorFormulario = '';

  private solicitudHoras?: Subscription;
  private citaOriginal?: Cita;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.patientService.listar().subscribe({
      next: data => this.pacientes = data,
      error: () => this.errorFormulario = 'No se pudo cargar la lista de pacientes.'
    });

    this.doctorService.listar().subscribe({
      next: data => this.medicos = data,
      error: () => this.errorFormulario = 'No se pudo cargar la lista de médicos.'
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.cargandoCita = true;
      this.appointmentService.buscarPorId(+id).subscribe({
        next: data => {
          this.cita = {
            ...data,
            pacienteId: Number(data.pacienteId),
            medicoId: Number(data.medicoId)
          };
          this.citaOriginal = { ...this.cita };
          this.cargandoCita = false;
          this.cargarHoras();
        },
        error: () => {
          this.cargandoCita = false;
          this.errorFormulario = 'No se pudo cargar la cita para editarla.';
        }
      });
    }
  }

  get puedeGuardar(): boolean {
    return !this.guardando && !this.cargandoCita && !this.cargandoHoras &&
      !this.errorHoras && this.cita.pacienteId > 0 &&
      this.cita.medicoId > 0 && !!this.cita.fecha &&
      !!this.cita.motivoConsulta.trim() && !!this.cita.hora &&
      this.horasDisponibles.includes(this.cita.hora);
  }

  cargarHoras(): void {
    this.solicitudHoras?.unsubscribe();
    this.horasDisponibles = [];
    this.cita.hora = '';
    this.errorHoras = '';
    this.cargandoHoras = false;

    if (!this.cita.medicoId || !this.cita.fecha) return;

    this.cargandoHoras = true;
    this.solicitudHoras = this.appointmentService.obtenerDisponibles(
      this.cita.medicoId, this.cita.fecha
    ).subscribe({
      next: data => {
        this.cargandoHoras = false;

        if (!Array.isArray(data) || !data.every(h => typeof h === 'string')) {
          this.errorHoras = 'La respuesta de horarios tiene un formato inesperado.';
          return;
        }

        this.horasDisponibles = [...new Set(data)].sort();

        // Conservar el horario reservado al editar la misma cita.
        const original = this.citaOriginal;
        if (original && original.medicoId === this.cita.medicoId &&
            original.fecha === this.cita.fecha && original.hora) {
          if (!this.horasDisponibles.includes(original.hora)) {
            this.horasDisponibles.push(original.hora);
            this.horasDisponibles.sort();
          }
          this.cita.hora = original.hora;
        }
      },
      error: err => {
        this.cargandoHoras = false;
        this.errorHoras = this.mensajeError(
          err, 'No se pudieron consultar las horas disponibles.'
        );
      }
    });
  }

  guardar(): void {
    if (!this.puedeGuardar) {
      this.errorFormulario = 'Completa los campos obligatorios y selecciona una hora.';
      return;
    }

    this.guardando = true;
    this.errorFormulario = '';

    const datos: Cita = {
      ...this.cita,
      pacienteId: Number(this.cita.pacienteId),
      medicoId: Number(this.cita.medicoId),
      motivoConsulta: this.cita.motivoConsulta.trim()
    };

    const solicitud = this.esEdicion
      ? this.appointmentService.actualizar(this.cita.id!, datos)
      : this.appointmentService.guardar(datos);

    solicitud.subscribe({
      next: () => {
        this.guardando = false;
        this.toast.show(
          `Cita ${this.esEdicion ? 'actualizada' : 'creada'}`, 'success'
        );
        this.router.navigate(['/appointments']);
      },
      error: err => {
        this.guardando = false;
        this.errorFormulario = this.mensajeError(
          err, 'No se pudo guardar la cita.'
        );
      }
    });
  }

  private mensajeError(err: any, texto: string): string {
    const mensaje = err.error?.mensaje || err.error?.message;
    return typeof mensaje === 'string' && mensaje.trim()
      ? mensaje
      : `${texto} Código HTTP: ${err.status ?? 'desconocido'}.`;
  }

  ngOnDestroy(): void {
    this.solicitudHoras?.unsubscribe();
  }
}