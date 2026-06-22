import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
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
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-listar-productos',
  imports: [CommonModule, ActualizarProductoComponent, ConfirmarModalComponent, FormsModule, HasPermissionDirective],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.scss'
})

export class ListarProductosComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('inputFiltro') inputFiltro!: ElementRef<HTMLInputElement>;

  constructor(
    private productoService: ProductoService,
    private marcaService: MarcaService,
    private proveedorService: ProveedorService,
    private toastrService: ToastrService,
    private categoriaService: CategoriaService,
    private unidadMedidaService: UnidadMedidaService,
    private authService: AuthService
  ){}

  categorias: CategoriaResponseDto[] = [];
  marcas: MarcaResponseDto[] = [];
  unidadesMedida: UnidadMedidaResponseDto[] = [];
  proveedores: ProveedorResponseDto[] = [];

  productosDto: ProductoResponseDto[] = [];

  productoActualizar: ProductoResponseDto | null = null;;
  mostrarActualizarProducto: boolean = false;

  mostrarConfirmarDesactivar: boolean = false;
  idProductoDesactivar: number | null = null;

  productosPorId: Map<number, ProductoResponseDto> = new Map();  // ← Tu diccionario

  textoBusqueda: string = '';

  // ─── Estado de paginación (server-side) ───────────────────────────────────────
  page: number = 1;
  pageSize: number = 20;
  total: number = 0;
  totalPages: number = 0;

  private busqueda$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // La búsqueda se envía al servidor con debounce; cada término reinicia a la página 1
    this.busqueda$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.page = 1;
        this.getProductosActivos();
      });

    this.getProductosActivos();

    // Agregamos esta validación de revisión de permisos para actualizar porque se necesitan cargar estas listas para que no vuelva a llamar las listas en el modal de actualizar, ya se las mandamos cargadas
    if (this.authService.hasPermission('productos.actualizar')) {
      this.getCategoriasActivas();
      this.getMarcasActivas();
      this.getUnidadesMedidaActivas();
      this.getProveedoresActivos();
    }

  }

  ngAfterViewInit(): void {
    this.enfocarInputFiltro();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Foco ────────────────────────────────────────────────────────────────────
  private enfocarInputFiltro(): void {
    setTimeout(() => {
      this.inputFiltro?.nativeElement.focus();
      this.inputFiltro?.nativeElement.select();
    }, 0);
  }

  getProductosActivos(): void {
    this.productoService.getProductosActivos(this.page, this.pageSize, this.textoBusqueda).subscribe({
      next:(resultado) => {
        this.productosDto = resultado.items;
        this.total = resultado.total;
        this.totalPages = resultado.totalPages;
        this.page = resultado.page;
        this.productosPorId = new Map(
          this.productosDto.map(producto => [producto.id, producto])
        );
      }
    });
  }

  getCategoriasActivas(): void {
    this.categoriaService.getCategoriasActivas().subscribe({
      next:(response) => {
        this.categorias = response;
      }
    });
  }

  getMarcasActivas(): void {
    this.marcaService.getMarcasActivas().subscribe({
      next:(response) => {
        this.marcas = response;
      }
    });
  }

  getUnidadesMedidaActivas(): void {
    this.unidadMedidaService.getUnidadesMedidaActivas().subscribe({
      next:(response) => {
        this.unidadesMedida = response;
      }
    });
  }

  getProveedoresActivos(): void {
    this.proveedorService.getProveedoresActivos().subscribe({
      next:(response) => {
        this.proveedores = response;
      }
    });
  }

  trackByProductoId(index: number, item: ProductoResponseDto): number {
    return item.id;
  }

  desactivarProductoPorCodigo(id: number): void {

    this.productoService.deactivateProducto(id).subscribe({
      next:() => {
        this.toastrService.success('Producto desactivado con éxito.')
        // Si era el último de la página actual, retrocede una página
        if (this.productosDto.length === 1 && this.page > 1) {
          this.page--;
        }
        this.getProductosActivos();
      }
    });
  }

  abrirModalActualizarProductoPorCodigo(codigo: string): void {
    if (!this.authService.hasPermission('productos.actualizar')) 
      return;
    
    // Llama al servicio en lugar de find()
    this.productoService.getProductoPorCodigo(codigo).subscribe({
      next: (producto) => {
        this.productoActualizar = producto;
        this.mostrarActualizarProducto = true;
      }
    });
  }

  cerrarModalActualizar(): void {
    this.mostrarActualizarProducto = false;
    this.productoActualizar = null;
    this.enfocarInputFiltro();
  }

  actualizarEnLista(objetoActualizado: ProductoResponseDto): void {
    const index = this.productosDto.findIndex(m => m.id === objetoActualizado.id);

    if (index !== -1) {
      this.productosDto[index] = objetoActualizado;
      this.productosPorId.set(objetoActualizado.id, objetoActualizado);
    }
  }

  mostrarModalConfirmarDesactivar(id: number): void {
    this.idProductoDesactivar = id;
    this.mostrarConfirmarDesactivar = true;
  }

  cerrarModalConfirmar(): void {
    this.mostrarConfirmarDesactivar = false;
    this.idProductoDesactivar = null;
  }

  // ─── Búsqueda (server-side con debounce) ──────────────────────────────────────
  onBuscar(): void {
    this.busqueda$.next(this.textoBusqueda);
  }

  limpiarTextoBusqueda(): void {
    this.textoBusqueda = '';
    this.page = 1;
    this.getProductosActivos();
  }

  // ─── Paginación ───────────────────────────────────────────────────────────────
  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPages || pagina === this.page) {
      return;
    }
    this.page = pagina;
    this.getProductosActivos();
  }

  paginaAnterior(): void {
    this.irAPagina(this.page - 1);
  }

  paginaSiguiente(): void {
    this.irAPagina(this.page + 1);
  }

  cambiarPageSize(nuevoTamano: number): void {
    this.pageSize = Number(nuevoTamano);
    this.page = 1;
    this.getProductosActivos();
  }
}
