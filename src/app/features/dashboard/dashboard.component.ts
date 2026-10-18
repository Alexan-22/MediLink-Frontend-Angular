import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PatientService } from '../../services/patient.service';
import { AppointmentService } from '../../services/appointment.service';
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
  sinPerfil = false;

  cargandoCitas = false;
  errorCitas = '';
  citasMedicoCargadas = false;
  totalCitasMedico = 0;

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
    private appointmentService: AppointmentService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getRole() || '';

    if (this.role === 'PACIENTE') {
      this.cargarPerfil();
      return;
    }

    if (this.role === 'MEDICO') {
      this.cargarResumenMedico();
      return;
    }

    if (['ADMIN', 'RECEPCIONISTA'].includes(this.role)) {
      this.reportService.getGeneral().subscribe(data => this.general = data);
    }

    if (['ADMIN', 'ENFERMERA'].includes(this.role)) {
      this.reportService.getCitasEstado().subscribe(data => this.estadoCitas = data);
    }

    if (['ADMIN', 'RECEPCIONISTA', 'ENFERMERA'].includes(this.role)) {
      this.reportService.getActivos().subscribe(data => this.activos = data);
    }
  }

  cargarResumenMedico(): void {
    if (this.role !== 'MEDICO' || this.cargandoCitas) return;

    this.cargandoCitas = true;
    this.citasMedicoCargadas = false;
    this.errorCitas = '';

    this.appointmentService.misCitasMedico().subscribe({
      next: citas => {
        this.totalCitasMedico = citas.length;
        this.estadoCitas = {
          programadas: citas.filter(c => c.estado === 'PROGRAMADA').length,
          atendidas: citas.filter(c => c.estado === 'ATENDIDA').length,
          canceladas: citas.filter(c => c.estado === 'CANCELADA').length,
          noAsistio: citas.filter(c => c.estado === 'NO_ASISTIO').length
        };
        this.cargandoCitas = false;
        this.citasMedicoCargadas = true;
      },
      error: err => {
        this.cargandoCitas = false;
        const mensaje = err.error?.mensaje || err.error?.message;
        this.errorCitas = typeof mensaje === 'string' && mensaje.trim()
          ? mensaje
          : 'No se pudo cargar el resumen de tus citas.';
      }
    });
  }

  cargarPerfil(): void {
    if (this.cargandoPerfil) return;

    this.cargandoPerfil = true;
    this.errorPerfil = '';
    this.sinPerfil = false;
    this.paciente = null;

    this.patientService.miPerfil().subscribe({
      next: data => {
        this.cargandoPerfil = false;
        this.paciente = data;
        if (!data) this.errorPerfil = 'No se encontró tu perfil de paciente.';
      },
      error: err => {
        this.cargandoPerfil = false;

        switch (err.status) {
          case 401:
            this.errorPerfil = 'Tu sesión no es válida. Vuelve a ingresar.';
            break;
          case 403:
            this.errorPerfil = 'Tu cuenta no tiene permiso para consultar este perfil.';
            break;
          case 404:
            this.sinPerfil = true;
            this.errorPerfil = 'Completa tus datos desde Mi perfil para crear tu ficha.';
            break;
          default:
            this.errorPerfil = 'No se pudo cargar tu perfil. Inténtalo nuevamente.';
        }
      }
    });
  }
}