import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../services/patient.service';
import { Paciente } from '../../../core/models/paciente.model';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  pacientes: Paciente[] = [];
  loading = false;
  constructor(private patientService: PatientService, private router: Router, private toast: ToastService) { }
  ngOnInit(): void { this.cargarPacientes(); }
  cargarPacientes(): void {
    this.loading = true;
    this.patientService.listar().subscribe({
      next: (data) => { this.pacientes = data; this.loading = false; },
      error: () => this.loading = false
    });
  }
  editar(id: number): void { this.router.navigate(['/patients/edit', id]); }
  verDetalle(id: number): void { this.router.navigate(['/patients/view', id]); }
  eliminar(id: number): void {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
      this.patientService.eliminar(id).subscribe(() => {
        this.toast.show('Paciente eliminado', 'success');
        this.cargarPacientes();
      });
    }
  }
}
