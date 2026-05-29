export interface RegistrarPagoProveedorUpsertDto {
    idProveedor: number;
    monto: number;
    idMetodoPago: number;
    referencia: string;
    observaciones: string;
}
