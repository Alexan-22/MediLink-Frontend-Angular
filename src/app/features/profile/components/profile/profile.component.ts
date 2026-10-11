import { Component }
from '@angular/core';

import { Router }
from '@angular/router';

import { AuthService }
from '../../../../services/auth.service';



@Component({

selector:'app-profile',

templateUrl:'./profile.component.html',

styleUrls:[

'./profile.component.scss'

]

})

export class ProfileComponent{


constructor(

public authService:AuthService,

private router:Router

){}



logout(){


this.authService.logout();


this.router.navigate(

['/auth/login']

);


}



}