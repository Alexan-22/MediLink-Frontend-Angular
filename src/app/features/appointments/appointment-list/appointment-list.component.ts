import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { CitaDetalleDTO } from '../../../core/models/cita.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent implements OnInit {
  citas: CitaDetalleDTO[] = [];
  loading = false;
  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private toast: ToastService
  ) { }
  ngOnInit(): void {
    this.cargarCitas();
  }
  cargarCitas(): void {
    this.loading = true;
    this.appointmentService.listarDetalle().subscribe({
      next: (data) => { this.citas = data; this.loading = false; },
      error: () => this.loading = false
    });
  }
  verDetalle(id: number): void {
    this.router.navigate(['/appointments/view', id]);
  }
  editar(id: number): void {
    this.router.navigate(['/appointments/edit', id]);
  }
  eliminar(id: number): void {
    if (confirm('¿Eliminar esta cita?')) {
      this.appointmentService.eliminar(id).subscribe(() => {
        this.toast.show('Cita eliminada', 'success');
        this.cargarCitas();
      });
    }
  }
  atender(id: number): void {
    if (confirm('Marcar como atendida?')) {
      this.appointmentService.atender(id).subscribe(() => {
        this.toast.show('Cita atendida', 'success');
        this.cargarCitas();
      });
    }
  }
  cancelar(id: number): void {
    if (confirm('Cancelar cita?')) {
      this.appointmentService.cancelar(id).subscribe(() => {
        this.toast.show('Cita cancelada', 'success');
        this.cargarCitas();
      });
    }
  }
  noAsistio(id: number): void {
    if (confirm('Marcar como No Asistió?')) {
      this.appointmentService.noAsistio(id).subscribe(() => {
        this.toast.show('Cita marcada como No Asistió', 'success');
        this.cargarCitas();
      });
    }
  }
}