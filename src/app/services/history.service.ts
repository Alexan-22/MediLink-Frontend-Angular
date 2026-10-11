import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistoriaClinica } from '../core/models/historia-clinica.model';

@Injectable({
providedIn:'root'
})
export class HistoryService{

private baseUrl=`${environment.apiUrl}/history`;

constructor(private http:HttpClient){}

guardar(historia:HistoriaClinica):Observable<HistoriaClinica>{
return this.http.post<HistoriaClinica>(
this.baseUrl,
historia
);
}

obtenerPorCita(id:number):Observable<HistoriaClinica>{
return this.http.get<HistoriaClinica>(
`${this.baseUrl}/cita/${id}`
);
}

}