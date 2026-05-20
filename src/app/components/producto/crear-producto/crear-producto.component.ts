import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { MarcaService } from '../../../services/marca.service';
import { MarcaResponseDto } from '../../../models/dtos/responses/marca-response-dto';
import { ProductoUpsertDto } from '../../../models/dtos/requests/producto-upsert-dto';
import { ProveedorResponseDto } from '../../../models/dtos/responses/proveedor-response-dto';
import { ProveedorService } from '../../../services/proveedor.service';
import { CategoriaResponseDto } from '../../../models/dtos/responses/categoria-response-dto';
import { UnidadMedidaResponseDto } from '../../../models/dtos/responses/unidad-medida-response-dto';
import { CategoriaService } from '../../../services/categoria.service';
import { UnidadMedidaService } from '../../../services/unidad-medida.service';

@Component({
  selector: 'app-crear-producto',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.scss'
})
export class CrearProductoComponent implements OnInit {

  constructor(
    private productoService: ProductoService,
    private marcaService: MarcaService,
    private proveedorService: ProveedorService,
    private toastrService: ToastrService,
    private categoriaService: CategoriaService,
    private unidadMedidaService: UnidadMedidaService
  ){}

  // @Output() expandir = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.getCategoriasActivas();
    this.getMarcasActivas();
    this.getUnidadesMedidaActivas();
    this.getProveedoresActivos();
  }

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

  categorias: CategoriaResponseDto[] = [];
  marcas: MarcaResponseDto[] = [];
  unidadesMedida: UnidadMedidaResponseDto[] = [];
  proveedores: ProveedorResponseDto[] = [];

  proveedoresPorId: Map<number, ProveedorResponseDto> = new Map();  // ← Tu diccionario
  
  marcaTexto: string = '';
  selectedProveedor: number = 0;

  getCategoriasActivas(): void {
    this.categoriaService.getCategoriasActivas().subscribe({
      next:(response) => {
        this.categorias = response;
      },
      error:() =>
        this.toastrService.error('Ocurrió un error al cargar las Categorias, por favor contacta al Administrador.')
    })
  }

  getMarcasActivas(): void {
    this.marcaService.getMarcasActivas().subscribe({
      next:(response) => {
        this.marcas = response;
      },
      error:() =>
        this.toastrService.error('Ocurrió un error al cargar las Marcas, por favor contacta al Administrador.')
    })
  }

  getUnidadesMedidaActivas(): void {
    this.unidadMedidaService.getUnidadesMedidaActivas().subscribe({
      next:(response) => {
        this.unidadesMedida = response;
      },
      error:() =>
        this.toastrService.error('Ocurrió un error al cargar las Unidades de Medida, por favor contacta al Administrador.')
    })
  }

  getProveedoresActivos(): void {
    this.proveedorService.getProveedoresActivos().subscribe({
      next:(response) => {
        this.proveedores = response;

        this.proveedoresPorId = new Map(
          this.proveedores.map(proveedor => [proveedor.id, proveedor])
        );
      },
      error:() =>
        this.toastrService.error('Ocurrió un error al cargar los Proveedores, por favor contacta al Administrador.')
    })
  }

  onMarcaInput(): void {
    const texto = this.marcaTexto.trim().toLowerCase();

    const marcaEncontrada = this.marcas.find(
      m => m.nombre.trim().toLowerCase() === texto
    );

    this.productoUpsertDto.idMarca = marcaEncontrada ? marcaEncontrada.id : 0;
  }

  agregarProducto(): void {
    const marcaEscrita = this.marcaTexto.trim();

    if (!marcaEscrita) {
      this.toastrService.error('Debe escribir o seleccionar una marca.');
      return;
    }

    const marcaExistente = this.marcas.find(
      m => m.nombre.trim().toLowerCase() === marcaEscrita.toLowerCase()
    );

    if (!marcaExistente) {
      this.toastrService.info(`La marca "${marcaEscrita}" no existe. Se creará la marca.`);
      
      // Aquí tienes 2 caminos:
      // 1) solo avisar y detenerte
      // return;

      // 2) crear la marca primero y luego guardar el producto
      this.marcaService.postMarca({ nombre: marcaEscrita }).subscribe({
        next: (marcaCreada) => {
          this.productoUpsertDto.idMarca = marcaCreada.id;

          const yaExiste = this.marcas.some(m => m.id === marcaCreada.id);
          if (!yaExiste) {
            this.marcas.push(marcaCreada);
          }

          this.guardarProducto();
        },
        error: (err) => {
          this.toastrService.error(err.error?.mensaje || 'No se pudo crear la marca.');
        }
      });

      return;
    }

    this.productoUpsertDto.idMarca = marcaExistente.id;
    this.guardarProducto();
  }

  guardarProducto(): void {
    this.productoService.postProducto(this.productoUpsertDto).subscribe({
      next:() => {
        this.toastrService.success('Producto creado correctamente');
        this.productoUpsertDto = {
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
        };

        this.marcaTexto = '';
      }
    });
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
}
