import { UnidadMedidaResponseDto } from "./unidad-medida-response-dto";

export interface ProductoSimpleResponseDto {
    id: number;
    codigo: string;
    nombre: string;
    costo: number;
    precio: number;
    stock: number;
    unidadMedida: UnidadMedidaResponseDto;
}