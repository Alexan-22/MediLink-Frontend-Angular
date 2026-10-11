import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Usuario } from '../core/models/usuario.model';

import { UsuarioRequest } from '../core/models/usuario-request.model';

import { ChangePasswordRequest } from '../core/models/change-password-request.model';



@Injectable({

providedIn:'root'

})

export class UserService{



private apiUrl =

`${environment.apiUrl}/users`;



constructor(

private http:HttpClient

){}



listar():Observable<Usuario[]>{


return this.http.get<Usuario[]>(

this.apiUrl

);

}



buscar(

id:number

):Observable<Usuario>{


return this.http.get<Usuario>(

`${this.apiUrl}/${id}`

);

}



guardar(

usuario:UsuarioRequest

):Observable<Usuario>{


return this.http.post<Usuario>(

this.apiUrl,

usuario

);

}



actualizar(

id:number,

usuario:UsuarioRequest

):Observable<Usuario>{


return this.http.put<Usuario>(

`${this.apiUrl}/${id}`,

usuario

);

}



eliminar(

id:number

){


return this.http.delete(

`${this.apiUrl}/${id}`

);

}



cambiarPassword(

id:number,

request:ChangePasswordRequest

){


return this.http.put(

`${this.apiUrl}/${id}/password`,

request

);

}


}