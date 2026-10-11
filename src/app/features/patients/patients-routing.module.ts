import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';

const routes: Routes = [
  { path: '', component: PatientListComponent },
  { path: 'new', component: PatientFormComponent },
  { path: 'edit/:id', component: PatientFormComponent },
  { path: 'view/:id', component: PatientDetailComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule { }
