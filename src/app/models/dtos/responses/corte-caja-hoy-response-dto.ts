export interface CorteDetalleVentaDto {
  idVenta: number;
  folio: string;
  fechaVenta: string;
  total: number;
}

export interface CorteDetallePagoDto {
  idPago: number;
  folio: string;
  fechaPago: string;
  monto: number;
  proveedor: string;
}

export interface CorteRealizadoDto {
  id: number;
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
  corteFinal: boolean;
  observaciones?: string;
  ventas: CorteDetalleVentaDto[];
  pagosProveedores: CorteDetallePagoDto[];
}

export interface CorteCajaHoyResponseDto {
  fechaOperacion: string;
  montoInicialCaja: number;
  montoVentas: number;
  montoPagoProveedores: number;
  corteCaja: number;
  idAperturaActiva?: number;
  cortePendiente: boolean;
  idUsuarioActivo?: string;
  nombreUsuarioActivo?: string;
  cortesRealizados: CorteRealizadoDto[];
}
