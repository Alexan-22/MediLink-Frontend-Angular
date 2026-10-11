import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { Paciente } from '../../../core/models/paciente.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent implements OnInit {
  paciente: Paciente = {
    dni: '', nombres: '', apellidos: '', fechaNacimiento: '', sexo: '',
    telefono: '', email: '', direccion: '', tipoSangre: '', alergias: '', estado: 'ACTIVO'
  };
  esEdicion = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private toast: ToastService
  ) { }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.patientService.buscarPorId(+id).subscribe(data => this.paciente = data);
    }
  }
  guardar(): void {
    const obs = this.esEdicion
      ? this.patientService.actualizar(this.paciente.id!, this.paciente)
      : this.patientService.guardar(this.paciente);
    obs.subscribe(() => {
      this.toast.show(`Paciente ${this.esEdicion ? 'actualizado' : 'creado'}`, 'success');
      this.router.navigate(['/patients']);
    });
  }
}
