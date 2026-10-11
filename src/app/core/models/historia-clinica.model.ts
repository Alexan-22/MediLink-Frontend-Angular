export interface HistoriaClinica{
id?:number;
pacienteId:number;
medicoId:number;
citaId:number;
diagnostico:string;
tratamiento:string;
receta:string;
fechaRegistro?:string;
}