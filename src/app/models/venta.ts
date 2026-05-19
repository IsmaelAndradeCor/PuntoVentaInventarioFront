import { DetalleVentaDto } from "./detalle-venta";

export interface VentaDto {
  folio: string;
  total: number;
  detalles: DetalleVentaDto[];
}