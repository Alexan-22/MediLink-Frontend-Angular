import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';

interface MiCita {
  id: number;
  paciente: string;
  medico: string;
  especialidad: string;
  fecha: string | null;
  hora: string | null;
  estado: string;
}

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.scss']
})
export class MyAppointmentsComponent implements OnInit {
  citas: MiCita[] = [];
  cargando = false;
  error = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    if (this.cargando) return;

    this.cargando = true;
    this.error = '';
    this.citas = [];

    this.appointmentService.misCitas().subscribe({
      next: data => {
        this.citas = data || [];
        this.cargando = false;
      },
      error: err => {
        this.cargando = false;

        switch (err.status) {
          case 401:
            this.error = 'Tu sesión no es válida. Cierra sesión y vuelve a ingresar.';
            break;
          case 403:
            this.error = 'Tu cuenta no tiene permiso para consultar esta sección.';
            break;
          case 404:
            this.error = 'Tu cuenta no tiene un paciente vinculado.';
            break;
          default:
            this.error = 'No se pudieron cargar tus citas. Inténtalo nuevamente.';
        }
      }
    });
  }

  nombreEstado(estado: string): string {
    const nombres: Record<string, string> = {
      PROGRAMADA: 'Programada',
      ATENDIDA: 'Atendida',
      CANCELADA: 'Cancelada',
      NO_ASISTIO: 'No asistió'
    };
    return nombres[estado] || estado;
  }

  trackById(index: number, cita: MiCita): number {
    return cita.id;
  }
}