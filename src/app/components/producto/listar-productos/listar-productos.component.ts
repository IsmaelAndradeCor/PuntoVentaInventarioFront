import { Component, OnInit, ViewChild } from '@angular/core';
import { ActualizarProductoComponent } from '../actualizar-producto/actualizar-producto.component';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { ProductoResponseDto } from '../../../models/dtos/responses/producto-response-dto';
import { MarcaService } from '../../../services/marca.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { CategoriaService } from '../../../services/categoria.service';
import { UnidadMedidaService } from '../../../services/unidad-medida.service';
import { CategoriaResponseDto } from '../../../models/dtos/responses/categoria-response-dto';
import { MarcaResponseDto } from '../../../models/dtos/responses/marca-response-dto';
import { UnidadMedidaResponseDto } from '../../../models/dtos/responses/unidad-medida-response-dto';
import { ProveedorResponseDto } from '../../../models/dtos/responses/proveedor-response-dto';
import { FormsModule } from '@angular/forms';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';

@Component({
  selector: 'app-listar-productos',
  imports: [CommonModule, ActualizarProductoComponent, ConfirmarModalComponent, FormsModule, HasPermissionDirective],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.scss'
})

export class ListarProductosComponent implements OnInit {

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
  idProductoDesactivar: number | null = null;

  productosPorId: Map<number, ProductoResponseDto> = new Map();  // ← Tu diccionario

  textoBusqueda: string = '';
  
  ngOnInit() {
    this.getProductosActivos();
    this.getCategoriasActivas();
    this.getMarcasActivas();
    this.getUnidadesMedidaActivas();
    this.getProveedoresActivos();
  }


  getProductosActivos(): void {
    // Convierte el arreglo a Map UNA SOLA VEZ al cargar

    this.productoService.getProductosActivos().subscribe({
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
        // this.toastrService.error('Ocurrió un error al cargar las Categorias, por favor contacta al Administrador.')
    });
  }

  getMarcasActivas(): void {
    this.marcaService.getMarcasActivas().subscribe({
      next:(response) => {
        this.marcas = response;
      },
      error:() => {}
        // this.toastrService.error('Ocurrió un error al cargar las Marcas, por favor contacta al Administrador.')
    });
  }

  getUnidadesMedidaActivas(): void {
    this.unidadMedidaService.getUnidadesMedidaActivas().subscribe({
      next:(response) => {
        this.unidadesMedida = response;
      },
      error:() => {}
        // this.toastrService.error('Ocurrió un error al cargar las Unidades de Medida, por favor contacta al Administrador.')
    });
  }

  getProveedoresActivos(): void {
    this.proveedorService.getProveedoresActivos().subscribe({
      next:(response) => {
        this.proveedores = response;
      },
      error:() => {}
        // this.toastrService.error('Ocurrió un error al cargar los Proveedores, por favor contacta al Administrador.')
    });
  }

  trackByProductoId(index: number, item: ProductoResponseDto): number {
    return item.id;
  }

  desactivarProductoPorCodigo(id: number): void {

    this.productoService.deactivateProducto(id).subscribe({
      next:() => {
        // 1. Eliminar del Map (rápido)
        this.productosPorId.delete(id);

        // 2. Recrear el array sin ese producto
        this.productosDto = this.productosDto.filter(x => x.id !== id);
        this.filtrarTabla();

        // 3. Muesta el mensaje de exito
        this.toastrService.success('Producto desactivado con éxito.')
      },
      error: (error) => {
        // this.toastrService.error('Ocurrió un error al desactivar el producto, por favor contacte al administrador.');
      }
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
      error: (error) => {
        // this.toastrService.error('Ocurrió un error al buscar el producto, por favor contacte al administrador.');
      }
    });
  }

  cerrarModalActualizar(): void {
    this.mostrarActualizarProducto = false;
    this.productoActualizar = null;
  }

  actualizarEnLista(objetoActualizado: ProductoResponseDto): void {
    const index = this.productosDto.findIndex(m => m.id === objetoActualizado.id);

    if (index !== -1) {
      this.productosDto[index] = objetoActualizado;
      this.productosFiltrados = [...this.productosDto];
      this.filtrarTabla();
    }

    this.cerrarModalActualizar();
  }

  mostrarModalConfirmarDesactivar(id: number): void {
    this.idProductoDesactivar = id;
    this.mostrarConfirmarDesactivar = true;
  }

  cerrarModalConfirmar(): void {
    this.mostrarConfirmarDesactivar = false;
    this.idProductoDesactivar = null;
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
