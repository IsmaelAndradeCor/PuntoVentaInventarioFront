// DTO para registrar venta desde el frontend

import { DetalleVentaDto } from "./detalle-venta";

// No contiene todos los campos de Venta porque es solo para registro inicial
export interface VentaDto {
  /// <summary>
  /// Folio único de la venta. Ejemplo: FOL-2026-0001
  /// Se genera en el frontend o backend
  /// </summary>
  folio: string;

  /// <summary>
  /// Total final de la venta (incluyendo descuentos)
  /// Se calcula en el frontend antes de enviar
  /// </summary>
  total: number;

  /// <summary>
  /// Lista de detalles/productos de la venta
  /// Cada elemento representa un renglón de venta
  /// </summary>
  detalles: DetalleVentaDto[];
}