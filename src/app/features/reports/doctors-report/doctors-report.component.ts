import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { Medico } from '../../../core/models/medico.model';

@Component({
  selector: 'app-doctors-report',
  templateUrl: './doctors-report.component.html',
  styleUrls: ['./doctors-report.component.scss']
})
export class DoctorsReportComponent implements OnInit {
  medicos: Medico[] = [];
  constructor(private doctorService: DoctorService) { }
  ngOnInit(): void {
    this.doctorService.listar().subscribe(data => this.medicos = data);
  }
}