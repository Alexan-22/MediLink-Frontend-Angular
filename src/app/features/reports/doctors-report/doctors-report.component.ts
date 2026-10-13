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
  cargando = false;
  error = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    if (this.cargando) return;

    this.cargando = true;
    this.error = '';

    this.doctorService.listar().subscribe({
      next: data => {
        this.medicos = data || [];
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.error = 'No se pudo cargar el reporte de médicos.';
      }
    });
  }

  get activos(): number {
    return this.medicos.filter(m => m.estado === 'ACTIVO').length;
  }
}