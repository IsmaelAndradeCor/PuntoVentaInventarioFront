export interface PagosProveedoresResponseDto {
    id: number;
    folio: string;
    nombreProveedor: string;
    monto: number;
    metodoPago: string;
    referencia: string;
    observaciones: string;
    fechaPago: Date;
}