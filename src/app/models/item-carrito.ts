import { ProductoSimpleResponseDto } from "./dtos/responses/producto-simple-response-dto";

export interface ItemCarrito {
  producto: ProductoSimpleResponseDto;
  cantidad: number;
}