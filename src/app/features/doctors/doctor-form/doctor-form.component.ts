import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { Medico } from '../../../core/models/medico.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.scss']
})
export class DoctorFormComponent implements OnInit {
  medico: Medico = {
    cmp: '', nombres: '', apellidos: '', especialidad: '', telefono: '', email: '',
    consultorio: '', horarioInicio: '08:00:00', horarioFin: '17:00:00', estado: 'ACTIVO'
  };
  esEdicion = false;
  constructor(private route: ActivatedRoute, private router: Router, private doctorService: DoctorService, private toast: ToastService) { }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.esEdicion = true; this.doctorService.buscarPorId(+id).subscribe(data => this.medico = data); }
  }
  guardar(): void {
    const obs = this.esEdicion ? this.doctorService.actualizar(this.medico.id!, this.medico) : this.doctorService.guardar(this.medico);
    obs.subscribe(() => { this.toast.show(`Médico ${this.esEdicion ? 'actualizado' : 'creado'}`, 'success'); this.router.navigate(['/doctors']); });
  }
}
