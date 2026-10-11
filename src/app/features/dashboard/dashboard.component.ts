import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report.service';

import { ReporteGeneralDTO }
from '../../core/models/reporte-general.dto';

import { ReporteCitasEstadoDTO }
from '../../core/models/reporte-citas-estado.dto';

import { ReporteActivosDTO }
from '../../core/models/reporte-activos.dto';


@Component({

  selector: 'app-dashboard',

  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.scss']

})

export class DashboardComponent
implements OnInit {


  role = '';


  general: ReporteGeneralDTO = {

      totalPacientes: 0,

      totalMedicos: 0,

      totalCitas: 0,

      totalNotificaciones: 0

  };


  estadoCitas: ReporteCitasEstadoDTO = {

      programadas: 0,

      atendidas: 0,

      canceladas: 0,

      noAsistio: 0

  };


  activos: ReporteActivosDTO = {

      pacientesActivos: 0,

      medicosActivos: 0

  };


  constructor(

      private reportService: ReportService

  ) {}


  ngOnInit(): void {

  this.role =
      localStorage.getItem('role') || '';


  if(this.role === 'ADMIN'){

      this.reportService
          .getGeneral()
          .subscribe(

              data =>

              this.general = data
          );


      this.reportService
          .getCitasEstado()
          .subscribe(

              data =>

              this.estadoCitas = data
          );


      this.reportService
          .getActivos()
          .subscribe(

              data =>

              this.activos = data
          );

  }


  if(this.role === 'MEDICO'){

      this.reportService
          .getCitasEstado()
          .subscribe(

              data =>

              this.estadoCitas = data
          );

  }


  if(this.role === 'RECEPCIONISTA'){

      this.reportService
          .getGeneral()
          .subscribe(

              data =>

              this.general = data
          );


      this.reportService
          .getActivos()
          .subscribe(

              data =>

              this.activos = data
          );

  }


  if(this.role === 'ENFERMERA'){

      this.reportService
          .getActivos()
          .subscribe(

              data =>

              this.activos = data
          );


      this.reportService
          .getCitasEstado()
          .subscribe(

              data =>

              this.estadoCitas = data
          );

  }

}


}