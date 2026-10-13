import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PatientService } from '../../services/patient.service';
import { ReportService } from '../../services/report.service';
import { Paciente } from '../../core/models/paciente.model';
import { ReporteGeneralDTO } from '../../core/models/reporte-general.dto';
import { ReporteCitasEstadoDTO } from '../../core/models/reporte-citas-estado.dto';
import { ReporteActivosDTO } from '../../core/models/reporte-activos.dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  role = '';
  paciente: Paciente | null = null;
  cargandoPerfil = false;
  errorPerfil = '';

  general: ReporteGeneralDTO = {
    totalPacientes: 0, totalMedicos: 0,
    totalCitas: 0, totalNotificaciones: 0
  };

  estadoCitas: ReporteCitasEstadoDTO = {
    programadas: 0, atendidas: 0, canceladas: 0, noAsistio: 0
  };

  activos: ReporteActivosDTO = {
    pacientesActivos: 0, medicosActivos: 0
  };

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole() || '';

    if (this.role === 'PACIENTE') {
      this.cargarPerfil();
      return;
    }

    if (['ADMIN', 'RECEPCIONISTA'].includes(this.role)) {
      this.reportService.getGeneral().subscribe(data => this.general = data);
    }

    if (['ADMIN', 'MEDICO', 'ENFERMERA'].includes(this.role)) {
      this.reportService.getCitasEstado().subscribe(data => this.estadoCitas = data);
    }

    if (['ADMIN', 'RECEPCIONISTA', 'ENFERMERA'].includes(this.role)) {
      this.reportService.getActivos().subscribe(data => this.activos = data);
    }
  }

  cargarPerfil(): void {
    if (this.cargandoPerfil) return;

    this.cargandoPerfil = true;
    this.errorPerfil = '';
    this.paciente = null;

    this.patientService.miPerfil().subscribe({
      next: data => {
        this.cargandoPerfil = false;
        this.paciente = data;

        if (!data) {
          this.errorPerfil = 'No se encontró tu perfil de paciente.';
        }
      },
      error: err => {
        this.cargandoPerfil = false;

        switch (err.status) {
          case 401:
            this.errorPerfil = 'Tu sesión no es válida. Cierra sesión y vuelve a ingresar.';
            break;
          case 403:
            this.errorPerfil = 'Tu cuenta no tiene permiso para consultar este perfil.';
            break;
          case 404:
            this.errorPerfil = 'Tu cuenta todavía no tiene un paciente vinculado.';
            break;
          default:
            this.errorPerfil = 'No se pudo cargar tu perfil. Inténtalo nuevamente.';
        }
      }
    });
  }
}