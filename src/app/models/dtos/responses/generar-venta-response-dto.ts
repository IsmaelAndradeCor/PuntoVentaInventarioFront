import { GenerarVentaDetalleResponseDto } from "./generar-venta-detalle-response-dto";

export interface GenerarVentaResponseDto {
    idVenta: number;
    folio: string;
    fechaVenta: string;
    subtotal: number;
    descuento: number;
    costoTotal: number;
    total: number;
    ganancias: number;
    formaPago: string;
    detalles: GenerarVentaDetalleResponseDto[];
}
