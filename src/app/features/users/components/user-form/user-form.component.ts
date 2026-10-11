import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioRequest } from '../../../../core/models/usuario-request.model';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  esEdicion = false;

  id = 0;

  usuario: UsuarioRequest = {

    username: '',

    password: '',

    rol: 'MEDICO'

  };


  roles = [

    'ADMIN',

    'RECEPCIONISTA',

    'MEDICO',

    'ENFERMERA',

    'PACIENTE'

  ];


  constructor(

    private userService: UserService,

    private router: Router,

    private route: ActivatedRoute

  ) { }


  ngOnInit(): void {


    const id = this.route.snapshot.paramMap.get(

      'id'

    );


    if (id) {


      this.esEdicion = true;


      this.id = Number(

        id

      );


      this.userService

        .buscar(

          this.id

        )

        .subscribe(


          usuario => {


            this.usuario = {


              username:

                usuario.username,


              password: '',


              rol:

                usuario.rol


            };


          }


        );


    }


  }


  guardar(): void {


    if (this.esEdicion) {


      this.userService

        .actualizar(

          this.id,

          this.usuario

        )

        .subscribe(


          () => {


            this.router.navigate(

              ['/users']

            );


          }


        );


    }


    else {


      this.userService

        .guardar(

          this.usuario

        )

        .subscribe(


          () => {


            this.router.navigate(

              ['/users']

            );


          }


        );


    }


  }



  cancelar(): void {


    this.router.navigate(

      ['/users']

    );


  }


}