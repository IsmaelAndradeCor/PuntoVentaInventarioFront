import { Component, OnInit } from '@angular/core';
import { productosMock, Producto } from '../../../models/producto.interface';
import { ActualizarProductoComponent } from '../actualizar-producto/actualizar-producto.component';
import { CommonModule } from '@angular/common';

// // Simular API
// const fetchProductos = async (): Promise<Producto[]> => {
//   return new Promise(resolve => setTimeout(() => resolve(productosMock), 500));
// };

@Component({
  selector: 'app-listar-productos',
  imports: [CommonModule ,ActualizarProductoComponent],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.scss'
})

export class ListarProductosComponent implements OnInit {

  productos: Producto[] = productosMock;
  productoActualizar: Producto | null = null;;
  mostrarActualizarProducto: boolean = false;

  productosPorCodigo: Map<string, Producto> = new Map();  // ← Tu diccionario
  
  ngOnInit() {
    // Convierte el arreglo a Map UNA SOLA VEZ al cargar
    this.productosPorCodigo = new Map(
      this.productos.map(producto => [producto.codigo, producto])
    );
    
    console.log('Map creado con', this.productosPorCodigo.size, 'productos');
  }

  eliminarProductoPorCodigo(codigo: string): void {
    // 1. Eliminar del Map (rápido)
    this.productosPorCodigo.delete(codigo);

    // 2. Recrear el array sin ese producto
    this.productos = this.productos.filter(x => x.codigo !== codigo);

    console.log('Producto Eliminado');
  }

  actualizarProductoPorCodigo(codigo: string): void {
    // Busca y asigna el producto
    this.productoActualizar = this.productos.find(p => p.codigo === codigo) || null;
    this.mostrarActualizarProducto = true;
  }

  cerrarModal(): void {
    this.mostrarActualizarProducto = false;
    this.productoActualizar = null;
  }

}
