import { Component } from '@angular/core';
import { ProductoDto } from '../../../models/producto.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-crear-producto',
  imports: [FormsModule, CommonModule],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.scss'
})
export class CrearProductoComponent {

  constructor(
    private productoService: ProductoService
  ){}

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

  agregarProducto(): void {
    this.productoService.postProducto(this.producto).subscribe({
      next:() => {
        alert('Producto Insertado Correctamente');
      },
      error:(error) => {
        alert(error);
      }
    });
  }

}
