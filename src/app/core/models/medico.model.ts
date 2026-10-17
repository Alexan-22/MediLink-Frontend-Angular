export interface Medico {
  id?: number;
  usuarioId?: number | null;
  cmp: string;
  nombres: string;
  apellidos: string;
  especialidad: string;
  telefono: string;
  email: string;
  consultorio: string;
  horarioInicio: string;
  horarioFin: string;
  estado: string;
}
