import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralReportComponent } from './general-report/general-report.component';
import { AppointmentsReportComponent } from './appointments-report/appointments-report.component';
import { PatientsReportComponent } from './patients-report/patients-report.component';
import { DoctorsReportComponent } from './doctors-report/doctors-report.component';

const routes: Routes = [
  { path: '', component: GeneralReportComponent },
  { path: 'appointments', component: AppointmentsReportComponent },
  { path: 'patients', component: PatientsReportComponent },
  { path: 'doctors', component: DoctorsReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }