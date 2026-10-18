import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient.service';
import { AuthService } from '../../../services/auth.service';
import { Paciente } from '../../../core/models/paciente.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  pacientes: Paciente[] = [];
  loading = false;
  eliminando = false;
  error = '';

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  get esAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  ngOnInit(): void {
    this.cargarPacientes();
  }

  cargarPacientes(): void {
    if (this.loading || this.eliminando) return;
    this.loading = true;
    this.error = '';

    this.patientService.listar().subscribe({
      next: data => {
        this.pacientes = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.error = this.obtenerError(err, 'No se pudieron cargar los pacientes.');
      }
    });
  }

  editar(id: number): void {
    this.router.navigate(['/patients/edit', id]);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/patients/view', id]);
  }

  eliminar(id: number): void {
    if (!this.esAdmin || this.eliminando ||
        !confirm('¿Está seguro de eliminar este paciente?')) return;

    this.eliminando = true;
    this.error = '';

    this.patientService.eliminar(id).subscribe({
      next: () => {
        this.eliminando = false;
        this.toast.show('Paciente eliminado', 'success');
        this.cargarPacientes();
      },
      error: err => {
        this.eliminando = false;
        this.error = this.obtenerError(err, 'No se pudo eliminar el paciente.');
      }
    });
  }

  private obtenerError(err: any, texto: string): string {
    const mensaje = err.error?.mensaje || err.error?.message;
    return typeof mensaje === 'string' && mensaje.trim() ? mensaje : texto;
  }
}
