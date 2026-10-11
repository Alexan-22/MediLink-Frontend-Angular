import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorsRoutingModule } from './doctors-routing.module';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorFormComponent } from './doctor-form/doctor-form.component';
import { DoctorDetailComponent } from './doctor-detail/doctor-detail.component';

@NgModule({
  declarations: [DoctorListComponent, DoctorFormComponent, DoctorDetailComponent],
  imports: [CommonModule, FormsModule, DoctorsRoutingModule]
})
export class DoctorsModule { }
