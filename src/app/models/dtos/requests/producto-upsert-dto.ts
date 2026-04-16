export interface ProductoUpsertDto {
    codigo: string;
    nombre: string;
    descripcion: string;
    costo: number;
    precio: number;
    stock: number;
    stockMinimo: number;
    idCategoria: number;
    idMarca: number;
    idUnidadMedida: number;
    idsProveedores: number[];
}
