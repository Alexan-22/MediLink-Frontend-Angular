import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientsRoutingModule } from './patients-routing.module';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientFormComponent } from './patient-form/patient-form.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';

@NgModule({
  declarations: [PatientListComponent, PatientFormComponent, PatientDetailComponent],
  imports: [CommonModule, FormsModule, PatientsRoutingModule]
})
export class PatientsModule { }
