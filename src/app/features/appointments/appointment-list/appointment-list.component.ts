import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppointmentService } from '../../../services/appointment.service';
import { AuthService } from '../../../services/auth.service';
import { Cita, CitaDetalleDTO } from '../../../core/models/cita.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  citas: CitaDetalleDTO[] = [];
  loading = false;
  procesando = false;
  error = '';

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  get esMedico(): boolean {
    return this.authService.getRole() === 'MEDICO';
  }

  get puedeGestionar(): boolean {
    return ['ADMIN', 'RECEPCIONISTA'].includes(this.authService.getRole() || '');
  }

  get puedeAtender(): boolean {
    return ['ADMIN', 'MEDICO'].includes(this.authService.getRole() || '');
  }

  get puedeRegistrarInasistencia(): boolean {
    return this.puedeGestionar || this.esMedico;
  }

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    if (this.loading || this.procesando) return;
    this.loading = true;
    this.error = '';
    this.citas = [];

    const solicitud = this.esMedico
      ? this.appointmentService.misCitasMedico()
      : this.appointmentService.listarDetalle();

    solicitud.subscribe({
      next: data => {
        this.citas = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.error = this.obtenerError(err, 'No se pudieron cargar las citas.');
      }
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/appointments/view', id]);
  }

  editar(id: number): void {
    if (this.puedeGestionar) this.router.navigate(['/appointments/edit', id]);
  }

  eliminar(id: number): void {
    if (this.authService.getRole() !== 'ADMIN') return;
    this.ejecutar(
      () => this.appointmentService.eliminar(id),
      '¿Eliminar esta cita?', 'Cita eliminada'
    );
  }

  atender(id: number): void {
    if (!this.puedeAtender || !this.esProgramada(id)) return;
    this.ejecutar(
      () => this.appointmentService.atender(id),
      '¿Marcar la cita como atendida?', 'Cita atendida'
    );
  }

  cancelar(id: number): void {
    if (!this.puedeGestionar || !this.esProgramada(id)) return;
    this.ejecutar(
      () => this.appointmentService.cancelar(id),
      '¿Cancelar esta cita?', 'Cita cancelada'
    );
  }

  noAsistio(id: number): void {
    if (!this.puedeRegistrarInasistencia || !this.esProgramada(id)) return;
    this.ejecutar(
      () => this.appointmentService.noAsistio(id),
      '¿Registrar que el paciente no asistió?', 'Inasistencia registrada'
    );
  }

  private esProgramada(id: number): boolean {
    return this.citas.some(cita => cita.id === id && cita.estado === 'PROGRAMADA');
  }

  private ejecutar(
    solicitud: () => Observable<Cita | void>,
    pregunta: string,
    mensaje: string
  ): void {
    if (this.procesando || this.loading || !confirm(pregunta)) return;
    this.procesando = true;
    this.error = '';

    solicitud().subscribe({
      next: () => {
        this.procesando = false;
        this.toast.show(mensaje, 'success');
        this.cargarCitas();
      },
      error: err => {
        this.procesando = false;
        this.error = this.obtenerError(err, 'No se pudo completar la operación.');
      }
    });
  }

  private obtenerError(err: any, texto: string): string {
    const mensaje = err.error?.mensaje || err.error?.message;
    return typeof mensaje === 'string' && mensaje.trim() ? mensaje : texto;
  }
}