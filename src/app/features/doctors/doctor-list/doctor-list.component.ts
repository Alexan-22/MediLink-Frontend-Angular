import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../services/doctor.service';
import { Medico } from '../../../core/models/medico.model';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss']
})
export class DoctorListComponent implements OnInit {
  medicos: Medico[] = [];
  loading = false;
  constructor(private doctorService: DoctorService, private router: Router, private toast: ToastService) { }
  ngOnInit(): void { this.cargarMedicos(); }
  cargarMedicos(): void {
    this.loading = true;
    this.doctorService.listar().subscribe({
      next: (data) => { this.medicos = data; this.loading = false; },
      error: () => this.loading = false
    });
  }
  editar(id: number): void { this.router.navigate(['/doctors/edit', id]); }
  verDetalle(id: number): void { this.router.navigate(['/doctors/view', id]); }
  eliminar(id: number): void {
    if (confirm('¿Eliminar médico?')) {
      this.doctorService.eliminar(id).subscribe(() => {
        this.toast.show('Médico eliminado', 'success');
        this.cargarMedicos();
      });
    }
  }
}
