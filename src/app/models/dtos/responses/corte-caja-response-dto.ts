export interface CorteCajaResponseDto {
  id: number;
  idAperturaCaja: number;
  fechaCorte: string;
  montoInicial: number;
  montoVentasEfectivo: number;
  montoPagoProveedores: number;
  montoEsperado: number;
  retiro: number;
  montoFinal: number;
  idUsuarioPrevio: string;
  nombreUsuarioPrevio: string;
  idUsuarioCorte: string;
  nombreUsuarioCorte: string;
  idUsuarioRecepcion?: string;
  nombreUsuarioRecepcion?: string;
  observaciones?: string;
  nuevoIdApertura?: number | null;
  nuevoMontoInicial?: number | null;
  corteFinal: boolean;
}
