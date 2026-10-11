export interface Cita {
  id?: number;
  pacienteId: number;
  medicoId: number;
  fecha: string;
  hora: string;
  motivoConsulta: string;
  observaciones: string;
  estado: string;
  fechaCreacion?: string;
  usuarioCreacion?: string;
}

export interface CitaDetalleDTO {
  id: number;
  paciente: string;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  estado: string;
  pacienteId:number;
  medicoId:number;
}
