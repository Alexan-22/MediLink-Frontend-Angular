
import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { Paciente } from '../../../core/models/paciente.model';

@Component({
  selector: 'app-patients-report',
  templateUrl: './patients-report.component.html',
  styleUrls: ['./patients-report.component.scss']
})
export class PatientsReportComponent implements OnInit {
  pacientes: Paciente[] = [];
  constructor(private patientService: PatientService) { }
  ngOnInit(): void {
    this.patientService.listar().subscribe(data => this.pacientes = data);
  }
}
