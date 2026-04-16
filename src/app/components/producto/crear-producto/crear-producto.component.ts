import { Component, OnInit } from '@angular/core';
import { ProductoDto } from '../../../models/producto.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto.service';
import { ToastrService } from 'ngx-toastr';
import { MarcaService } from '../../../services/marca.service';
import { MarcaResponseDto } from '../../../models/dtos/responses/marca-response-dto';
import { ProductoUpsertDto } from '../../../models/dtos/requests/producto-upsert-dto';

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
    private toastrService: ToastrService
  ){}

  ngOnInit(): void {
    this.getMarcas();
  }

  producto: ProductoDto = {
    id: 0,
    codigo: '',
    nombre: '',
    descripcion: '',
    precioCompra: 0,
    precioVenta: 0,
    stock: 0,
    stockMinimo: 0,
    categoria: '',
    proveedor: ''
  };

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

  marcas: MarcaResponseDto[] = [];

  getMarcas(): void {
    this.marcaService.getMarcas().subscribe({
      next:(response) => {
        this.marcas = response;
      },
      error:() =>
        this.toastrService.error('Ocurrió un error al cargar las Marcas, por favor contacta al Administrador.')
    })
  }

  agregarProducto(): void {
    this.productoService.postProducto(this.producto).subscribe({
      next:() => {
        this.toastrService.success('Producto creado correctamente');
        this.producto = {
                          id: 0,
                          codigo: '',
                          nombre: '',
                          descripcion: '',
                          precioCompra: 0,
                          precioVenta: 0,
                          stock: 0,
                          stockMinimo: 0,
                          categoria: '',
                          proveedor: ''
                        };
      },
      error:(err) => {
      if (err.status === 400) {
        console.error(err.error.mensaje);
      } else if (err.status === 500) {
        console.error('Error interno del servidor: ' + err.error);
      } else if (err.status === 0) {
        console.error('No se pudo conectar con el servidor');
      } else {
        console.error('Ocurrió un error inesperado');
      }
      
      this.toastrService.error(err.error.mensaje);
      }
    });
  }

}
