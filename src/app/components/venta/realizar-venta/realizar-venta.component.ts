import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemCarrito } from '../../../models/item-carrito';
import { VentaDto } from '../../../models/venta';
import { VentaService } from '../../../services/venta.service';
import { ToastrService } from 'ngx-toastr';
import { ProductoSimpleResponseDto } from '../../../models/dtos/responses/producto-simple-response-dto';
import { RouterLink } from '@angular/router';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';

@Component({
  selector: 'app-realizar-venta',
  imports: [CommonModule, FormsModule, RouterLink, HasPermissionDirective],
  templateUrl: './realizar-venta.component.html',
  styleUrl: './realizar-venta.component.scss'
})
export class RealizarVentaComponent implements OnInit {

  @ViewChild('inputCodigo') inputCodigo!: ElementRef<HTMLInputElement>;
  @ViewChild('inputCambio') inputCambio!: ElementRef<HTMLInputElement>;
  // @ViewChild('buttonRealizarVenta') buttonRealizarVenta!: ElementRef<HTMLInputElement>;

  constructor(
    private productoService: ProductoService,
    private ventaService: VentaService,
    private toastrService: ToastrService
  ){}

  productos: ProductoSimpleResponseDto[] = [];
  productosOriginal: ProductoSimpleResponseDto[] = [];
  productosPorCodigo: Map<string, ProductoSimpleResponseDto> = new Map();
  stockOriginalPorCodigo: Map<string, number> = new Map();
  
  codigoProducto: string = '';
  dineroRecibido: number = 0;
  // cambioDar: number = 0;

  // carrito: ProductoDto[] = [];
  // Propiedad del carrito
  carrito: ItemCarrito[] = [];

  ngOnInit() {
    this.getProductosVenta();
  }

  getProductosVenta(): void {
    this.productoService.getProductosVenta().subscribe({
      next:(productosResponse) => {
        this.productosOriginal = productosResponse;
        this.productos = productosResponse;

        this.productosPorCodigo = new Map(
          this.productos.map(producto => [producto.codigo, producto])
        );

        this.stockOriginalPorCodigo = new Map(
          this.productosOriginal.map(producto => [producto.codigo, producto.stock])
        );
      }
    });
  }

  ngAfterViewInit() {
    this.enfocarInputCodigo();
  }

  @HostListener('document:keydown.escape', ['$event'])
  manejarTeclaEsc(event: Event) {
    event.preventDefault();
    this.enfocarInputCodigo();
  }

  enfocarInputCodigo() {
    setTimeout(() => {
      this.inputCodigo?.nativeElement.focus();
      this.inputCodigo?.nativeElement.select();
    }, 0);
  }

  @HostListener('document:keydown.tab', ['$event'])
  manejarTeclaTab(event: Event) {
    event.preventDefault();
    this.enfocarInputCambio();
  }

  enfocarInputCambio() {
    setTimeout(() => {
      this.inputCambio?.nativeElement.focus();
      this.inputCambio?.nativeElement.select();
    }, 0);
  }

  @HostListener('document:keydown.control.enter', ['$event'])
  manejarTeclaIntro(event: Event) {
    event.preventDefault();
    this.finalizarVenta();
  }

  agregarProductoPorCodigo() {
    const entrada = this.codigoProducto.trim();
    let cantidad = 1;
    let codigo = entrada;
    if (entrada.includes('*')) {
      const partes = entrada.split('*');

      if (partes.length === 2 && partes[0] && partes[1]) {
        cantidad = Number(partes[0]);
        codigo = partes[1].trim();
      } else {
        this.toastrService.error('Multiplicación incorrecta para código de producto.');
        // Limpiar input para próximo escaneo
        this.codigoProducto = '';
        this.enfocarInputCodigo();
        return;
      }
    }

    if (codigo && this.productosPorCodigo.has(codigo)) {
      const producto = this.productosPorCodigo.get(codigo)!;

      //Ya validamos que existe el producto y se intenta agregar una cantidad especifica de productos, validamos si la cantidad es decimal, el producto igual debe ser decimal, y viceversa
      const esEntero = Number.isInteger(cantidad);
      const permiteDecimales = producto.unidadMedida.permiteDecimales;

      if (!permiteDecimales && !esEntero) {
        this.toastrService.error('El Producto no es fraccionario.');
        // Limpiar input para próximo escaneo
        this.codigoProducto = '';
        this.enfocarInputCodigo();
        return;
      }
      // Agregar al carrito individual
      this.agregarAlCarrito(producto, cantidad);
    } else {
      this.toastrService.error('Producto no encontrado.')
    }
    // Limpiar input para próximo escaneo
    this.codigoProducto = '';
    this.enfocarInputCodigo();
  }

  // agregarProductoPorCodigo() {
  //   if (this.codigoProducto && this.productosPorCodigo.has(this.codigoProducto)) {
  //     const producto = this.productosPorCodigo.get(this.codigoProducto)!;
  //     // Agregar al carrito individual
  //     this.agregarAlCarrito(producto);
  //   } else {
  //     alert('Producto no encontrado');
  //   }
  //   // Limpiar input para próximo escaneo
  //   this.codigoProducto = '';
  //   this.enfocarInputCodigo();
  // }

  agregarAlCarrito(producto: ProductoSimpleResponseDto, cantidad: number) {
    const stockDisponible = this.obtenerStockDisponible(producto.codigo);

    if (stockDisponible <= 0) {
      this.toastrService.error('Sin inventario');
      return;
    }

    if (cantidad <= 0 || isNaN(Number(cantidad))) {
      this.toastrService.error('Cantidad inválida');
      return;
    }

    if (stockDisponible < cantidad) {
      this.toastrService.error('Inventario insuficiente, la cantidad supera al stock.');
      return;
    }

    const itemExistente = this.carrito.find(
      item => item.producto.codigo === producto.codigo
    );

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      this.carrito.push({
        producto: { ...producto },
        cantidad: cantidad
      });
    }
  }

  disminuirCantidad(index: number) {
    const item = this.carrito[index];
    if (!item) return;

    const permiteDecimales = item.producto.unidadMedida.permiteDecimales;
    const decremento = permiteDecimales ? 0.01 : 1;

    if (item.cantidad > decremento) {
      item.cantidad = Number((item.cantidad - decremento).toFixed(2));
    } else {
      this.carrito.splice(index, 1);
    }

    this.enfocarInputCodigo();
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => 
      total + (item.cantidad * item.producto.precio), 0
    );
  }

  calcularCambio(): number {
    const totalVenta = this.calcularTotal();

    if (this.dineroRecibido <= totalVenta) {
      return 0;
    }
    return this.dineroRecibido - totalVenta;
  }

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
    if (!this.carrito.length){
      this.toastrService.error('Carrito vacio.')
      return;
    }

    const venta: VentaDto = {
      detalles: this.carrito.map(item => ({
        idProducto: item.producto.id,
        cantidad: item.cantidad
      }))
    };

    this.ventaService.registrarVenta(venta).subscribe({
      next: (response) => {
        this.getProductosVenta();
        this.toastrService.success(`Venta ${response.folio} registrada con éxito!`, 'Éxito!');
        this.carrito = [];
        this.codigoProducto = '';
        this.dineroRecibido = 0;
        this.enfocarInputCodigo();

        console.log('Venta registrada:', response.idVenta, response.folio, response.total);
      },
      error: () => {
        this.dineroRecibido = 0;
        this.enfocarInputCodigo();
      }
    });
  }
  
  private obtenerStockOriginal(codigo: string): number {
    return this.stockOriginalPorCodigo.get(codigo) ?? 0;
  }

  private obtenerCantidadEnCarrito(codigo: string, excluirIndex?: number): number {
    return this.carrito.reduce((total, item, index) => {
      if (item.producto.codigo !== codigo) return total;
      if (excluirIndex !== undefined && index === excluirIndex) return total;
      return total + item.cantidad;
    }, 0);
  }

  obtenerStockDisponible(codigo: string): number {
    const stockOriginal = this.obtenerStockOriginal(codigo);
    const cantidadEnCarrito = this.obtenerCantidadEnCarrito(codigo);
    return stockOriginal - cantidadEnCarrito;
  }

  obtenerMaximoPermitido(codigo: string, index: number): number {
    const stockOriginal = this.obtenerStockOriginal(codigo);
    const cantidadOtros = this.obtenerCantidadEnCarrito(codigo, index);
    return stockOriginal - cantidadOtros;
  }

  actualizarCantidadItem(index: number, nuevoValor: number | string): void {
    const item = this.carrito[index];
    if (!item) return;

    const cantidad = Number(nuevoValor);
    const producto = item.producto;
    const permiteDecimales = producto.unidadMedida.permiteDecimales;
    const maximo = this.obtenerMaximoPermitido(producto.codigo, index);

    if (isNaN(cantidad) || cantidad <= 0) {
      this.toastrService.error('Cantidad inválida');
      item.cantidad = 1;
      return;
    }

    if (!permiteDecimales && !Number.isInteger(cantidad)) {
      this.toastrService.error('El producto no es fraccionario.');
      return;
    }

    if (cantidad > maximo) {
      this.toastrService.error('Inventario insuficiente, la cantidad supera al stock.');
      item.cantidad = maximo > 0 ? maximo : 1;
      return;
    }

    item.cantidad = cantidad;
  }
  
}

