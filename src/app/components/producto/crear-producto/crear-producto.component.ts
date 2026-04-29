import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { MarcaService } from '../../../services/marca.service';
import { MarcaResponseDto } from '../../../models/dtos/responses/marca-response-dto';
import { ProductoUpsertDto } from '../../../models/dtos/requests/producto-upsert-dto';
import { ProveedorResponsetDto } from '../../../models/dtos/responses/proveedor-response-dto';
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

  ngOnInit(): void {
    this.getCategorias();
    this.getMarcas();
    this.getUnidadesMedida();
    this.getProveedores();
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
  proveedores: ProveedorResponsetDto[] = [];

  proveedoresPorId: Map<number, ProveedorResponsetDto> = new Map();  // ← Tu diccionario
  
  marcaTexto: string = '';
  selectedProveedor: number = 0;

  getCategorias(): void {
    this.categoriaService.getCategorias().subscribe({
      next:(response) => {
        this.categorias = response;
      },
      error:() =>
        this.toastrService.error('Ocurrió un error al cargar las Categorias, por favor contacta al Administrador.')
    })
  }

  getMarcas(): void {
    this.marcaService.getMarcas().subscribe({
      next:(response) => {
        this.marcas = response;
      },
      error:() =>
        this.toastrService.error('Ocurrió un error al cargar las Marcas, por favor contacta al Administrador.')
    })
  }

  getUnidadesMedida(): void {
    this.unidadMedidaService.getUnidadesMedida().subscribe({
      next:(response) => {
        this.unidadesMedida = response;
      },
      error:() =>
        this.toastrService.error('Ocurrió un error al cargar las Unidades de Medida, por favor contacta al Administrador.')
    })
  }

  getProveedores(): void {
    this.proveedorService.getProveedores().subscribe({
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
      },
      error:(err) => {
        console.error(err.error);
        if (err.error?.errors) {
          console.error(err.error)
          Object.entries(err.error.errors).forEach(([campo, mensajes]) => {
            (mensajes as string[]).forEach(mensaje => {
              this.toastrService.error(`${mensaje}`);
              // this.toastrService.error(`${campo}: ${mensaje}`);
            });
          });
          return;
        }
      //   console.log(err);
      // if (err.status === 400) {
      //   if (err.error?.errors) {
      //     Object.entries(err.error.errors).forEach(([campo, mensajes]) => {
      //       (mensajes as string[]).forEach(mensaje => {
      //         this.toastrService.error(`${campo}: ${mensaje}`);
      //       });
      //     });
      //     return;
      //   }
      // } else if (err.status === 500) {
      //   console.error('Error interno del servidor: ' + err.error);
      // } else if (err.status === 0) {
      //   console.error('No se pudo conectar con el servidor');
      // } else {
      //   console.error('Ocurrió un error inesperado');
      // }
      
      // this.toastrService.error(err.error.mensaje);
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
