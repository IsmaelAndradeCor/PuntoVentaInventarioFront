export interface RegistrarPagoProveedorUpsertDto {
    idProveedor: number;
    monto: number;
    metodoPago: string;
    referencia: string;
    observaciones: string;
}
