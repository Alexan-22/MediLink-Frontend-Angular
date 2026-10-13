import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { MyAppointmentsComponent } from './my-appointments/my-appointments.component';

const rolesPersonal = ['ADMIN', 'RECEPCIONISTA', 'MEDICO', 'ENFERMERA'];

const routes: Routes = [
  {
    path: 'me',
    component: MyAppointmentsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['PACIENTE'] }
  },
  {
    path: '',
    pathMatch: 'full',
    component: AppointmentListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: rolesPersonal }
  },
  {
    path: 'new',
    component: AppointmentFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: rolesPersonal }
  },
  {
    path: 'edit/:id',
    component: AppointmentFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: rolesPersonal }
  },
  {
    path: 'view/:id',
    component: AppointmentDetailComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: rolesPersonal }
  },
  {
    path: 'calendar',
    component: AppointmentCalendarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: rolesPersonal }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule {}