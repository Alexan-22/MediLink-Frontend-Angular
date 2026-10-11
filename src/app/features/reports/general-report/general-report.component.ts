import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report.service';
import { ReporteGeneralDTO } from '../../../core/models/reporte-general.dto';
import { ReporteCitasEstadoDTO } from '../../../core/models/reporte-citas-estado.dto';
import { ReporteActivosDTO } from '../../../core/models/reporte-activos.dto';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.scss']
})
export class GeneralReportComponent implements OnInit {
  general: ReporteGeneralDTO = { totalPacientes: 0, totalMedicos: 0, totalCitas: 0, totalNotificaciones: 0 };
  citasEstado: ReporteCitasEstadoDTO = { programadas: 0, atendidas: 0, canceladas: 0, noAsistio: 0 };
  activos: ReporteActivosDTO = { pacientesActivos: 0, medicosActivos: 0 };

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.reportService.getGeneral().subscribe(data => this.general = data);
    this.reportService.getCitasEstado().subscribe(data => this.citasEstado = data);
    this.reportService.getActivos().subscribe(data => this.activos = data);
  }
}
