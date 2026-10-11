import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentsRoutingModule } from './appointments-routing.module';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { AppointmentCalendarComponent } from './appointment-calendar/appointment-calendar.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';

@NgModule({
  declarations: [
    AppointmentListComponent,
    AppointmentFormComponent,
    AppointmentCalendarComponent,
    AppointmentDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppointmentsRoutingModule
  ]
})
export class AppointmentsModule { }