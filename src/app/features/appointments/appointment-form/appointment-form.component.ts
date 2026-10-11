
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { Cita } from '../../../core/models/cita.model';
import { ToastService } from '../../../services/toast.service';
import { PatientService } from '../../../services/patient.service';
import { DoctorService } from '../../../services/doctor.service';
import { Paciente } from '../../../core/models/paciente.model';
import { Medico } from '../../../core/models/medico.model';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {
  cita: Cita = {
    pacienteId: 0,
    medicoId: 0,
    fecha: '',
    hora: '',
    motivoConsulta: '',
    observaciones: '',
    estado: 'PROGRAMADA'
  };
  esEdicion = false;
  pacientes: Paciente[] = [];
  medicos: Medico[] = [];
  horasDisponibles:string[]=[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    this.cargarPacientes();
    this.cargarMedicos();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.appointmentService.buscarPorId(+id).subscribe(data => this.cita = data);
    }
  }

  cargarPacientes(): void {
    this.patientService.listar().subscribe(data => this.pacientes = data);
  }

  cargarMedicos(): void {
    this.doctorService.listar().subscribe(data => this.medicos = data);
  }

  guardar(): void {
    const obs = this.esEdicion
      ? this.appointmentService.actualizar(this.cita.id!, this.cita)
      : this.appointmentService.guardar(this.cita);
    obs.subscribe(() => {
      this.toast.show(`Cita ${this.esEdicion ? 'actualizada' : 'creada'}`, 'success');
      this.router.navigate(['/appointments']);
    });
  }

  cargarHoras(){
if(!this.cita.medicoId ||
!this.cita.fecha){return;
}
this.appointmentService.obtenerDisponibles(
this.cita.medicoId,
this.cita.fecha)
.subscribe(data=>{this.horasDisponibles = data;});
}

}