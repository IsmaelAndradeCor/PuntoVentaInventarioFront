export interface RegistrarMermaUpsertDto {
    detalles: RegistrarMermaDetalleUpsertDto[];
    observaciones?: string;
}

export interface RegistrarMermaDetalleUpsertDto {
    idProducto: number;
    cantidad: number;
}
