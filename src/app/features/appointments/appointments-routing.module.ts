
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';

const routes: Routes = [
  { path: '', component: AppointmentListComponent },
  { path: 'new', component: AppointmentFormComponent },
  { path: 'edit/:id', component: AppointmentFormComponent },
  { path: 'view/:id', component: AppointmentDetailComponent },
  { path: 'calendar', component: AppointmentCalendarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentsRoutingModule { }