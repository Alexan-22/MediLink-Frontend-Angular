import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { AuthService } from '../../../services/auth.service';
import { Medico } from '../../../core/models/medico.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent implements OnInit {
  medicos: Medico[] = [];
  loading = false;
  eliminando = false;
  error = '';

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  get esAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos(): void {
    if (this.loading || this.eliminando) return;
    this.loading = true;
    this.error = '';

    this.doctorService.listar().subscribe({
      next: data => {
        this.medicos = data;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.error = this.obtenerError(err, 'No se pudieron cargar los médicos.');
      }
    });
  }

  editar(id: number): void {
    if (this.esAdmin) this.router.navigate(['/doctors/edit', id]);
  }

  verDetalle(id: number): void {
    this.router.navigate(['/doctors/view', id]);
  }

  eliminar(id: number): void {
    if (!this.esAdmin || this.eliminando || !confirm('¿Eliminar médico?')) return;
    this.eliminando = true;
    this.error = '';

    this.doctorService.eliminar(id).subscribe({
      next: () => {
        this.eliminando = false;
        this.toast.show('Médico eliminado', 'success');
        this.cargarMedicos();
      },
      error: err => {
        this.eliminando = false;
        this.error = this.obtenerError(err, 'No se pudo eliminar el médico.');
      }
    });
  }

  private obtenerError(err: any, texto: string): string {
    const mensaje = err.error?.mensaje || err.error?.message;
    return typeof mensaje === 'string' && mensaje.trim() ? mensaje : texto;
  }
}