import { Component } from '@angular/core';
import { productosMock, Producto } from '../../../models/producto.interface';

// // Simular API
// const fetchProductos = async (): Promise<Producto[]> => {
//   return new Promise(resolve => setTimeout(() => resolve(productosMock), 500));
// };

@Component({
  selector: 'app-listar-productos',
  imports: [],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.scss'
})

export class ListarProductosComponent {

  productos: Producto[] = productosMock;
}
