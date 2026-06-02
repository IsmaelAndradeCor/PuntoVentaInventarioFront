import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { FormsModule } from '@angular/forms';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';
import { ProductoService } from '../../../services/producto.service';
import { MarcaService } from '../../../services/marca.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriaService } from '../../../services/categoria.service';
import { UnidadMedidaService } from '../../../services/unidad-medida.service';
import { CategoriaResponseDto } from '../../../models/dtos/responses/categoria-response-dto';
import { MarcaResponseDto } from '../../../models/dtos/responses/marca-response-dto';
import { UnidadMedidaResponseDto } from '../../../models/dtos/responses/unidad-medida-response-dto';
import { ProveedorResponseDto } from '../../../models/dtos/responses/proveedor-response-dto';
import { ProductoResponseDto } from '../../../models/dtos/responses/producto-response-dto';

@Component({
  selector: 'app-listar-productos-inactivos',
  imports: [CommonModule, ConfirmarModalComponent, FormsModule, HasPermissionDirective],
  templateUrl: './listar-productos-inactivos.component.html',
  styleUrl: './listar-productos-inactivos.component.scss'
})
export class ListarProductosInactivosComponent implements OnInit {

  constructor(
    private productoService: ProductoService,
    private marcaService: MarcaService,
    private proveedorService: ProveedorService,
    private toastrService: ToastrService,
    private categoriaService: CategoriaService,
    private unidadMedidaService: UnidadMedidaService
  ){}

  categorias: CategoriaResponseDto[] = [];
  marcas: MarcaResponseDto[] = [];
  unidadesMedida: UnidadMedidaResponseDto[] = [];
  proveedores: ProveedorResponseDto[] = [];

  productosDto: ProductoResponseDto[] = [];
  productosFiltrados: ProductoResponseDto[] = [];

  productoActualizar: ProductoResponseDto | null = null;;
  mostrarActualizarProducto: boolean = false;

  mostrarConfirmarDesactivar: boolean = false;
  idProductoActivar: number | null = null;

  productosPorId: Map<number, ProductoResponseDto> = new Map();  // ← Tu diccionario

  textoBusqueda: string = '';
  
  ngOnInit() {
    this.getProductosInactivos();
    this.getCategoriasActivas();
    this.getMarcasActivas();
    this.getUnidadesMedidaActivas();
    this.getProveedoresActivos();
  }


  getProductosInactivos(): void {
    // Convierte el arreglo a Map UNA SOLA VEZ al cargar

    this.productoService.getProductosInactivos().subscribe({
      next:(prodcutosResponse) => {
        this.productosDto = prodcutosResponse;
        this.productosFiltrados = [...this.productosDto];
        this.productosPorId = new Map(
          this.productosDto.map(producto => [producto.id, producto])
        );
        
        // console.log('Map creado con', this.productosPorId.size, 'productos');
      }
    });
  }

  getCategoriasActivas(): void {
    this.categoriaService.getCategoriasActivas().subscribe({
      next:(response) => {
        this.categorias = response;
      },
      error:() => {}
    })
  }

  getMarcasActivas(): void {
    this.marcaService.getMarcasActivas().subscribe({
      next:(response) => {
        this.marcas = response;
      },
      error:() => {}
    })
  }

  getUnidadesMedidaActivas(): void {
    this.unidadMedidaService.getUnidadesMedidaActivas().subscribe({
      next:(response) => {
        this.unidadesMedida = response;
      },
      error:() => {}
    })
  }

  getProveedoresActivos(): void {
    this.proveedorService.getProveedoresActivos().subscribe({
      next:(response) => {
        this.proveedores = response;
      },
      error:() => {}
    })
  }

  trackByProductoId(index: number, item: ProductoResponseDto): number {
    return item.id;
  }

  activarProductoPorCodigo(id: number): void {

    this.productoService.activateProducto(id).subscribe({
      next:() => {
        // 1. Eliminar del Map (rápido)
        this.productosPorId.delete(id);

        // 2. Recrear el array sin ese producto
        this.productosDto = this.productosDto.filter(x => x.id !== id);
        this.filtrarTabla();

        // 3. Muesta el mensaje de exito
        this.toastrService.success('Producto activado con éxito.')
      },
      error: () => {}          
    });
  }

  abrirModalActualizarProductoPorCodigo(codigo: string): void {
    // Llama al servicio en lugar de find()
    this.productoService.getProductoPorCodigo(codigo).subscribe({
      next: (producto) => {
        this.productoActualizar = producto;
        // console.log(producto);
        this.mostrarActualizarProducto = true;
      },
      error: () => {}          
    });
  }

  cerrarModalActualizar(): void {
    this.mostrarActualizarProducto = false;
    this.productoActualizar = null;
  }

  mostrarModalConfirmar(id: number): void {
    this.idProductoActivar = id;
    this.mostrarConfirmarDesactivar = true;
  }

  cerrarModalConfirmar(): void {
    this.mostrarConfirmarDesactivar = false;
    this.idProductoActivar = null;
  }

  filtrarTabla(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();

    if (!texto) {
      this.productosFiltrados = [...this.productosDto];
      return;
    }

    this.productosFiltrados = this.productosDto.filter(p =>
      p.codigo.toLowerCase().includes(texto) ||
      p.nombre.toLowerCase().includes(texto)
    );
  }

  limpiarTextoBusqueda(): void {
    this.textoBusqueda = '';
    this.filtrarTabla();
  }
}