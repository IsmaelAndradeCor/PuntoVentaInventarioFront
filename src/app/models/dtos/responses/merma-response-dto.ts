export interface MermaResponseDto {
    id: number;
    folio: string;
    fechaMerma: string;
    costoTotal: number;
    observaciones?: string;
    idUsuario: string;
    detalles: MermaDetalleResponseDto[];
}

export interface MermaDetalleResponseDto {
    id: number;
    idProducto: number;
    codigoProducto: string;
    nombreProducto: string;
    cantidad: number;
    costoUnitario: number;
    costoTotal: number;
}
