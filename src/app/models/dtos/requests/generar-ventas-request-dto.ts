export interface GenerarVentasRequestDto {
    fechaInicio?: string | null;
    fechaFin?: string | null;
    incluirDetalle: boolean;
    idMarca?: number | null;
    idProveedor?: number | null;
    detallesFiltrados?: boolean;
}
