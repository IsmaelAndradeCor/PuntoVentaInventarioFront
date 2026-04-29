import { Component, Input, Output, EventEmitter, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Para ngModel
import { ProductoService } from '../../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { ProductoResponseDto } from '../../../models/dtos/responses/producto-response-dto';
import { CategoriaResponseDto } from '../../../models/dtos/responses/categoria-response-dto';
import { ProductoUpsertDto } from '../../../models/dtos/requests/producto-upsert-dto';
import { MarcaResponseDto } from '../../../models/dtos/responses/marca-response-dto';
import { UnidadMedidaResponseDto } from '../../../models/dtos/responses/unidad-medida-response-dto';
import { ProveedorResponsetDto } from '../../../models/dtos/responses/proveedor-response-dto';

@Component({
  selector: 'app-actualizar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-producto.component.html',
  styleUrl: './actualizar-producto.component.scss'
})
export class ActualizarProductoComponent implements OnInit {

  constructor(
    private productoService: ProductoService,
    private toastrService: ToastrService
  ){}

  @Input() productoActualizar: ProductoResponseDto | null = null;  // Quita required si inicializas
  @Input() categorias: CategoriaResponseDto[] = [];
  @Input() marcas: MarcaResponseDto[] = []; 
  @Input() unidadesMedida: UnidadMedidaResponseDto[] = [];
  @Input() proveedores: ProveedorResponsetDto[] = [];  
  @Input() mostrarActualizarProducto = false;

  @Output() cerrarModal = new EventEmitter<void>();  // ← Output correcto para cerrar

  productoUpsertDto: ProductoUpsertDto = {
    codigo: '',
    nombre: '',
    descripcion: '',
    costo: 0,
    precio: 0,
    stock: 0,
    stockMinimo: 0,
    idCategoria: 0,
    idMarca: 0,
    idUnidadMedida: 0,
    idsProveedores: []
  }

  selectedProveedor: number = 0;
  proveedoresPorId: Map<number, ProveedorResponsetDto> = new Map();  // ← Tu diccionario

  ngOnInit(): void {
    this.proveedoresPorId = new Map(
      this.proveedores.map(proveedor => [proveedor.id, proveedor])
    );

    if (this.productoActualizar?.proveedores) {
      this.productoUpsertDto.idsProveedores =
        this.productoActualizar.proveedores.map(p => p.id);
    }
  }

  cerrar() {
    this.cerrarModal.emit();  // Emite evento al padre
  }

  guardarCambios() {
    if (this.productoActualizar) {

      this.productoUpsertDto.codigo = this.productoActualizar.codigo;
      this.productoUpsertDto.nombre = this.productoActualizar.nombre;
      this.productoUpsertDto.descripcion = this.productoActualizar.descripcion;
      this.productoUpsertDto.costo = this.productoActualizar.costo;
      this.productoUpsertDto.precio = this.productoActualizar.precio;
      this.productoUpsertDto.stock = this.productoActualizar.stock;
      this.productoUpsertDto.stockMinimo = this.productoActualizar.stockMinimo;
      this.productoUpsertDto.idCategoria = this.productoActualizar.categoria.id;
      this.productoUpsertDto.idMarca = this.productoActualizar.marca.id;
      this.productoUpsertDto.idUnidadMedida = this.productoActualizar.unidadMedida.id;


      
      this.productoService.putProducto(this.productoUpsertDto).subscribe({
        next: () => {
          this.toastrService.success('Producto actualizado correctamente.');
          this.cerrar();
        },
        error: (error) => {
          console.log(error);
          const errores = error?.error?.errors;

          if (errores) {
            Object.keys(errores).forEach(campo => {
              errores[campo].forEach((mensaje: string) => {
                this.toastrService.error(mensaje);
              });
            });
          } else {
            this.toastrService.error('Ocurrió un error al actualizar');
          }
        }
      });
    }
  }

  nombreProveedor(id: number): string {
    return this.proveedoresPorId.get(id)?.nombre ?? 'Proveedor no encontrado';
  }

  agregarProveedor(id: number): void {
    if (id === 0) {
      this.toastrService.error('Debe seleccionar un Proveedor.');
      return;
    }

    if (this.productoUpsertDto.idsProveedores.includes(id)) {
      this.toastrService.error('Ya agregó este proveedor.');
      setTimeout(() => this.selectedProveedor = 0);
      return;
    }

    this.productoUpsertDto.idsProveedores.push(id);
    setTimeout(() => this.selectedProveedor = 0);
  }

  quitarProveedor(id: number): void {
    this.productoUpsertDto.idsProveedores =
      this.productoUpsertDto.idsProveedores.filter(p => p !== id);
      setTimeout(() => this.selectedProveedor = 0);

  }
  //   guardarCambios() {
  //   if (this.productoActualizar) {

  //     this.productoActualizar.costo = Number(this.productoActualizar.costo) || 0;
  //     this.productoActualizar.precio = Number(this.productoActualizar.precio) || 0;
  //     this.productoActualizar.stock = Number(this.productoActualizar.stock) || 0;
  //     this.productoActualizar.stockMinimo = Number(this.productoActualizar.stockMinimo) || 0;
      
  //     this.productoService.putProducto(this.productoActualizar.codigo!, this.productoActualizar).subscribe({
  //       next: () => {
  //         this.toastrService.success('Producto actualizado correctamente.');
  //         this.cerrar();
  //       },
  //       error: (error) => {
  //         console.log(error);
  //         const errores = error?.error?.errors;

  //         if (errores) {
  //           Object.keys(errores).forEach(campo => {
  //             errores[campo].forEach((mensaje: string) => {
  //               this.toastrService.error(mensaje);
  //             });
  //           });
  //         } else {
  //           this.toastrService.error('Ocurrió un error al actualizar');
  //         }
  //       }
  //     });
  //   }
  // }
}
