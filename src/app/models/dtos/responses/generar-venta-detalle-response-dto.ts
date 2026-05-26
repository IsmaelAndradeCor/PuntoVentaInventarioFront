export interface GenerarVentaDetalleResponseDto {
    idDetalleVenta: number;
    idProducto: number;
    codigoProducto: string;
    nombreProducto: string;
    cantidad: number;
    costoUnitario: number;
    costoTotal: number;
    precioUnitario: number;
    precioTotal: number;
}
