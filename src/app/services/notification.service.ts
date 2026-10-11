import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacion } from '../core/models/notificacion.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private baseUrl = `${environment.apiUrl}/notifications`;
  constructor(private http: HttpClient) { }

  listar(): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(this.baseUrl);
  }
  buscarPorId(id: number): Observable<Notificacion> {
    return this.http.get<Notificacion>(`${this.baseUrl}/${id}`);
  }
  guardar(notificacion: Notificacion): Observable<Notificacion> {
    return this.http.post<Notificacion>(this.baseUrl, notificacion);
  }
  actualizar(id: number, notificacion: Notificacion): Observable<Notificacion> {
    return this.http.put<Notificacion>(`${this.baseUrl}/${id}`, notificacion);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
