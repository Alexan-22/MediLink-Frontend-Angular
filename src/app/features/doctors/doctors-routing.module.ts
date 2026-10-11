import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';
import { DoctorDetailComponent } from './doctor-detail/doctor-detail.component';

const routes: Routes = [
  { path: '', component: DoctorListComponent },
  { path: 'new', component: DoctorFormComponent },
  { path: 'edit/:id', component: DoctorFormComponent },
  { path: 'view/:id', component: DoctorDetailComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorsRoutingModule { }
