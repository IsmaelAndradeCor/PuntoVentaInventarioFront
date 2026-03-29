// DTO para cada renglón de venta
export interface DetalleVentaDto {
  /// <summary>
  /// ID del producto en la base de datos
  /// Obligatorio para identificar qué producto se está vendiendo
  /// </summary>
  idProducto: number;

  /// <summary>
  /// Código del producto (para mostrar en ticket)
  /// Se guarda en el detalle para conservar historial
  /// </summary>
  codigo: string;

  /// <summary>
  /// Nombre del producto (para mostrar en ticket)
  /// Se guarda en el detalle para conservar historial
  /// </summary>
  nombre: string;

  /// <summary>
  /// Cantidad vendida de este producto
  /// </summary>
  cantidad: number;

  /// <summary>
  /// Precio unitario al momento de la venta
  /// Se guarda en el detalle para conservar historial de precios
  /// </summary>
  precio: number;
}