import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { Paciente } from '../../../core/models/paciente.model';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.scss']
})
export class PatientDetailComponent implements OnInit {
  paciente?: Paciente;
  constructor(private route: ActivatedRoute, private patientService: PatientService) { }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.patientService.buscarPorId(+id).subscribe(data => this.paciente = data);
  }
}
