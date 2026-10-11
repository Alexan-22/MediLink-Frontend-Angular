import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from '../../../services/appointment.service';
import { HistoryService } from '../../../services/history.service';
import { ToastService } from '../../../services/toast.service';
import { CitaDetalleDTO } from '../../../core/models/cita.model';
import { HistoriaClinica } from '../../../core/models/historia-clinica.model';

@Component({
selector:'app-appointment-detail',
templateUrl:'./appointment-detail.component.html',
styleUrls:['./appointment-detail.component.scss']
})
export class AppointmentDetailComponent implements OnInit{

detalle?:CitaDetalleDTO;
historia?:HistoriaClinica;

mostrarFormulario=false;

nuevaHistoria:HistoriaClinica={
pacienteId:0,
medicoId:0,
citaId:0,
diagnostico:'',
tratamiento:'',
receta:''
};

constructor(
private route:ActivatedRoute,
private appointmentService:AppointmentService,
private historyService:HistoryService,
private toast:ToastService
){}

ngOnInit():void{

const id=this.route.snapshot.paramMap.get('id');

if(id){

this.appointmentService.detalle(+id).subscribe(data=>{

this.detalle=data;

this.historyService.obtenerPorCita(+id).subscribe({

next:h=>{

this.historia=h;

},

error:()=>{

this.historia=undefined;

}

});

});

}

}

abrirFormulario(){

this.mostrarFormulario=true;

}

guardarHistoria(){

if(!this.detalle)return;

this.nuevaHistoria.pacienteId=
this.detalle.pacienteId;

this.nuevaHistoria.medicoId=
this.detalle.medicoId;

this.nuevaHistoria.citaId=
this.detalle.id;

this.historyService.guardar(

this.nuevaHistoria

).subscribe({

next:resp=>{

this.historia=resp;

this.mostrarFormulario=false;

this.nuevaHistoria={

pacienteId:0,

medicoId:0,

citaId:0,

diagnostico:'',

tratamiento:'',

receta:''

};

this.toast.show(

'Historia clínica registrada',

'success'

);

},

error:err=>{

this.toast.show(

err.error?.message ||

'Error al registrar historial clínico',

'error'

);

}

});

}

}