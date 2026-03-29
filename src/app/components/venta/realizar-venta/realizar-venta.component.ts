import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { ProductoDto } from '../../../models/producto.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleVentaDto } from '../../../models/detalle-venta';
import { VentaDto } from '../../../models/venta';
import { VentaService } from '../../../services/venta.service';

@Component({
  selector: 'app-realizar-venta',
  imports: [CommonModule, FormsModule],
  templateUrl: './realizar-venta.component.html',
  styleUrl: './realizar-venta.component.scss'
})
export class RealizarVentaComponent implements OnInit {

  constructor(
    private productoService: ProductoService,
    private ventaService: VentaService
  ){}

  productosDto: ProductoDto[] = [];
  productosPorCodigo: Map<string, ProductoDto> = new Map();  // ← Tu diccionario
  
  codigoProducto: string = '';

  // carrito: ProductoDto[] = [];
  // Propiedad del carrito
  carrito: ItemCarrito[] = [];

  ngOnInit() {
    this.productoService.getProductos().subscribe({
      next:(prodcutosResponse) => {
        this.productosDto = prodcutosResponse;

        this.productosPorCodigo = new Map(
          this.productosDto.map(producto => [producto.codigo, producto])
        );
        
        console.log('Map creado con', this.productosPorCodigo.size, 'productos');
      }
    });
  }

  agregarProductoPorCodigo() {
    if (this.codigoProducto && this.productosPorCodigo.has(this.codigoProducto)) {
      const producto = this.productosPorCodigo.get(this.codigoProducto)!;
      // Agregar al carrito
      this.agregarAlCarrito(producto);
    } else {
      alert('Producto no encontrado');
    }
    // Limpiar input para próximo escaneo
    this.codigoProducto = '';
  }

  // Función corregida ✅
  agregarAlCarrito(producto: ProductoDto) {
    const itemExistente = this.carrito.find(item => 
      item.producto.codigo === producto.codigo  // Ahora existe producto.codigo
    );
    
    if (itemExistente) {
      itemExistente.cantidad++;  // ✅ itemExistente tiene cantidad
    } else {
      this.carrito.push({ 
        producto, 
        cantidad: 1 
      });  // ✅ Crea ItemCarrito
    }
    
    // this.calcularTotal();  // Actualizar totales
  }

  quitarItem(index: number) {
    this.carrito.splice(index, 1);
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => 
      total + (item.cantidad * item.producto.precioVenta), 0
    );
  }

  // private xmlDetalleVenta(detalles: DetalleVentaDto[]): string {
  //   const itemsXml = detalles.map(d => `
  //     <Item>
  //       <IdProducto>${d.idProducto}</IdProducto>
  //       <Codigo>${d.codigo}</Codigo>
  //       <Nombre>${d.nombre}</Nombre>
  //       <Cantidad>${d.cantidad}</Cantidad>
  //       <Precio>${d.precio}</Precio>
  //     </Item>
  //   `).join('');

  //   return `<Items>${itemsXml}</Items>`;
  // }

  /// <summary>
  /// Genera un folio único secuencial para la venta.
  /// Formato: FOL-2026-0001, FOL-2026-0002, etc.
  /// 
  /// Usa localStorage para mantener un contador local
  /// (ya que no hay backend para consultar folios existentes).
  /// </summary>
  /// <returns>Folio en formato FOL-YYYY-NNNN</returns>
  private generarFolio(): string {
    const año = new Date().getFullYear();
    const clave = `folio_${año}`;
    
    // Obtener contador actual o inicializar en 1
    let contador = parseInt(localStorage.getItem(clave) || '0') + 1;
    
    // Guardar para próxima vez
    localStorage.setItem(clave, contador.toString());
    
    // Formatear con 4 dígitos (0001, 0002, etc.)
    const numeroFormateado = contador.toString().padStart(4, '0');
    
    return `FOL-${año}-${numeroFormateado}`;
  }

  finalizarVenta() {
    const venta: VentaDto = {
      folio: this.generarFolio(),
      total: this.calcularTotal(),
      detalles: this.carrito.map(item => ({
        idProducto: item.producto.id,
        codigo: item.producto.codigo,
        nombre: item.producto.nombre,
        cantidad: item.cantidad,
        precio: item.producto.precioVenta
      }))
    };

    this.ventaService.registrarVenta(venta).subscribe(idVenta => {
      console.log('Venta #' + idVenta + ' registrada exitosamente');
      this.carrito = []; // Limpiar carrito
      // this.mostrarExito('Venta registrada correctamente');
    });
  }
  
}



export interface ItemCarrito {
  producto: ProductoDto;
  cantidad: number;
}