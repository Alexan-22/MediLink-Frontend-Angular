import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReporteGeneralDTO } from '../core/models/reporte-general.dto';
import { ReporteCitasEstadoDTO } from '../core/models/reporte-citas-estado.dto';
import { ReporteActivosDTO } from '../core/models/reporte-activos.dto';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private baseUrl = `${environment.apiUrl}/reports`;
  constructor(private http: HttpClient) { }

  getGeneral(): Observable<ReporteGeneralDTO> {
    return this.http.get<ReporteGeneralDTO>(`${this.baseUrl}/general`);
  }
  getCitasEstado(): Observable<ReporteCitasEstadoDTO> {
    return this.http.get<ReporteCitasEstadoDTO>(`${this.baseUrl}/citas-estado`);
  }
  getActivos(): Observable<ReporteActivosDTO> {
    return this.http.get<ReporteActivosDTO>(`${this.baseUrl}/activos`);
  }
}
