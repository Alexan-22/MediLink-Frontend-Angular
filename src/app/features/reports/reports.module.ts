import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { GeneralReportComponent } from './general-report/general-report.component';
import { AppointmentsReportComponent } from './appointments-report/appointments-report.component';
import { PatientsReportComponent } from './patients-report/patients-report.component';
import { DoctorsReportComponent } from './doctors-report/doctors-report.component';

@NgModule({
  declarations: [
    GeneralReportComponent,
    AppointmentsReportComponent,
    PatientsReportComponent,
    DoctorsReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }