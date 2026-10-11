export interface Notificacion {
  id?: number;
  citaId: number;
  tipo: string;
  destinatario: string;
  mensaje: string;
  fechaEnvio?: string;
  estado: string;
}
