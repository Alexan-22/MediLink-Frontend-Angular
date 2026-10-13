export interface Paciente {
  id?: number;
  usuarioId?: number | null;
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: string;
  telefono: string;
  email: string;
  direccion: string;
  tipoSangre: string;
  alergias: string;
  estado: string;
  fechaRegistro?: string;
}
