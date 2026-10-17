import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medico } from '../core/models/medico.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private apiUrl = `${environment.apiUrl}/doctors`;
  constructor(private http: HttpClient) { }

  listar(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.apiUrl);
  }
  buscarPorId(id: number): Observable<Medico> {
    return this.http.get<Medico>(`${this.apiUrl}/${id}`);
  }
  guardar(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(this.apiUrl, medico);
  }
  actualizar(id: number, medico: Medico): Observable<Medico> {
    return this.http.put<Medico>(`${this.apiUrl}/${id}`, medico);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  contarActivos(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/activos`);
  }
  miPerfil(): Observable<Medico> {
  return this.http.get<Medico>(`${this.apiUrl}/me`);
}

vincularUsuario(medicoId: number, usuarioId: number): Observable<Medico> {
  return this.http.put<Medico>(`${this.apiUrl}/${medicoId}/usuario`, {
    usuarioId
  });
}
}
