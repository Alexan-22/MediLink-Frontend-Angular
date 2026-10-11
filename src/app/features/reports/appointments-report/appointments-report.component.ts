
import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../services/appointment.service';
import { Cita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-appointments-report',
  templateUrl: './appointments-report.component.html',
  styleUrls: ['./appointments-report.component.scss']
})
export class AppointmentsReportComponent implements OnInit {
  citas: Cita[] = [];
  constructor(private appointmentService: AppointmentService) { }
  ngOnInit(): void {
    this.appointmentService.listar().subscribe(data => this.citas = data);
  }
}
