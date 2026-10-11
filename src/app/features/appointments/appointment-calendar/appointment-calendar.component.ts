
import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { Cita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss']
})
export class AppointmentCalendarComponent implements OnInit {
  citas: Cita[] = [];
  citasAgrupadas: { [fecha: string]: Cita[] } = {};

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.appointmentService.listar().subscribe(data => {
      this.citas = data;
      this.agruparPorFecha();
    });
  }

  agruparPorFecha(): void {
    this.citasAgrupadas = {};
    this.citas.forEach(cita => {
      if (!this.citasAgrupadas[cita.fecha]) {
        this.citasAgrupadas[cita.fecha] = [];
      }
      this.citasAgrupadas[cita.fecha].push(cita);
    });
  }

  getFechas(): string[] {
    return Object.keys(this.citasAgrupadas).sort();
  }
}