import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita, CitaDetalleDTO } from '../core/models/cita.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private baseUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  misCitas(): Observable<CitaDetalleDTO[]> {
    return this.http.get<CitaDetalleDTO[]>(`${this.baseUrl}/me`);
  }

  listar(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.baseUrl);
  }

  listarDetalle(): Observable<CitaDetalleDTO[]> {
    return this.http.get<CitaDetalleDTO[]>(`${this.baseUrl}/listado`);
  }

  buscarPorId(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.baseUrl}/${id}`);
  }

  guardar(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(this.baseUrl, cita);
  }

  actualizar(id: number, cita: Cita): Observable<Cita> {
    return this.http.put<Cita>(`${this.baseUrl}/${id}`, cita);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  detalle(id: number): Observable<CitaDetalleDTO> {
    return this.http.get<CitaDetalleDTO>(`${this.baseUrl}/detail/${id}`);
  }

  contarPorEstado(estado: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count/${estado}`);
  }

  atender(id: number): Observable<Cita> {
    return this.http.put<Cita>(`${this.baseUrl}/${id}/atender`, {});
  }

  cancelar(id: number): Observable<Cita> {
    return this.http.put<Cita>(`${this.baseUrl}/${id}/cancelar`, {});
  }

  noAsistio(id: number): Observable<Cita> {
    return this.http.put<Cita>(`${this.baseUrl}/${id}/no-asistio`, {});
  }

  obtenerDisponibles(medicoId: number, fecha: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/disponibles/${medicoId}/${fecha}`
    );
  }

  misCitasMedico(): Observable<CitaDetalleDTO[]> {
  return this.http.get<CitaDetalleDTO[]>(`${this.baseUrl}/medico/me`);
  }
}
