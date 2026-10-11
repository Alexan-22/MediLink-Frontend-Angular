import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';

import { UserService }
from '../../../../services/user.service';



@Component({

selector:'app-change-password',

templateUrl:'./change-password.component.html',

styleUrls:[

'./change-password.component.scss'

]

})

export class ChangePasswordComponent{


id=0;


password='';


confirmPassword='';


constructor(

private route:ActivatedRoute,

private router:Router,

private userService:UserService

){



this.id=

Number(

this.route.snapshot.paramMap.get(

'id'

)

);


}



guardar(){


if(

this.password

!=

this.confirmPassword

){

alert(

'Las contraseñas no coinciden'

);

return;

}



this.userService

.cambiarPassword(


this.id,


{

password:

this.password


}


)

.subscribe(


()=>{


alert(

'Contraseña actualizada'

);


this.router.navigate(

['/users']

);


}


);



}



cancelar(){


this.router.navigate(

['/users']

);


}


}