import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';

import { UsersListComponent } from './components/users-list/users-list.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

@NgModule({

  declarations: [

    UsersListComponent,

    UserFormComponent,

    ChangePasswordComponent

  ],

  imports: [

    CommonModule,

    FormsModule,

    UsersRoutingModule

  ]

})

export class UsersModule { }