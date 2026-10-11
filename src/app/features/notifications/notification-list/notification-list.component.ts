import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { Notificacion } from '../../../core/models/notificacion.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  notificaciones: Notificacion[] = [];
  loading = false;
  nuevaNotificacion: Notificacion = {
    citaId: 0,
    tipo: 'EMAIL',
    destinatario: '',
    mensaje: '',
    estado: 'PENDIENTE'
  };
  mostrarForm = false;

  constructor(private notificationService: NotificationService, private toast: ToastService) { }

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones(): void {
    this.loading = true;
    this.notificationService.listar().subscribe({
      next: (data) => { this.notificaciones = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  crearNotificacion(): void {
    this.notificationService.guardar(this.nuevaNotificacion).subscribe(() => {
      this.toast.show('Notificación creada', 'success');
      this.cargarNotificaciones();
      this.mostrarForm = false;
      this.nuevaNotificacion = { citaId: 0, tipo: 'EMAIL', destinatario: '', mensaje: '', estado: 'PENDIENTE' };
    });
  }

  eliminar(id: number): void {
    if (confirm('Eliminar notificación?')) {
      this.notificationService.eliminar(id).subscribe(() => {
        this.toast.show('Notificación eliminada', 'success');
        this.cargarNotificaciones();
      });
    }
  }
}