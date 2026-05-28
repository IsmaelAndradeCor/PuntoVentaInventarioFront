import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class RealizarVentaComponent implements OnInit, AfterViewInit {

  @ViewChild('inputCodigo') inputCodigo!: ElementRef<HTMLInputElement>;
  @ViewChild('inputCambio') inputCambio!: ElementRef<HTMLInputElement>;

  constructor(
    private productoService: ProductoService,
    private ventaService: VentaService,
    private toastrService: ToastrService
  ) {}

  productos: ProductoSimpleResponseDto[] = [];
  productosPorCodigo: Map<string, ProductoSimpleResponseDto> = new Map();
  stockOriginalPorCodigo: Map<string, number> = new Map();

  codigoProducto: string = '';
  dineroRecibido: number = 0;
  carrito: ItemCarrito[] = [];

  // ─── Estado temporal para el input de importe ───────────────────────────────
  // Clave: índice del carrito, Valor: string del importe que el usuario está escribiendo
  importesTemporales: Map<number, string> = new Map();

  // ─── Constantes ─────────────────────────────────────────────────────────────
  private readonly DECIMALES_CANTIDAD = 4;
  private readonly DECIMALES_DINERO = 2;

  // ─── Ciclo de vida ──────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.cargarProductos();
  }

  ngAfterViewInit(): void {
    this.enfocarInputCodigo();
  }

  // ─── Teclado global ─────────────────────────────────────────────────────────
  @HostListener('document:keydown.escape', ['$event'])
  onEsc(event: Event): void {
    event.preventDefault();
    this.enfocarInputCodigo();
  }

  @HostListener('document:keydown.tab', ['$event'])
  onTab(event: Event): void {
    event.preventDefault();
    this.enfocarInputCambio();
  }

  @HostListener('document:keydown.control.enter', ['$event'])
  onCtrlEnter(event: Event): void {
    event.preventDefault();
    this.finalizarVenta();
  }

  // ─── Carga de datos ─────────────────────────────────────────────────────────
  private cargarProductos(): void {
    this.productoService.getProductosVenta().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.productosPorCodigo = new Map(productos.map(p => [p.codigo, p]));
        this.stockOriginalPorCodigo = new Map(productos.map(p => [p.codigo, p.stock]));
      }
    });
  }

  // ─── Foco ────────────────────────────────────────────────────────────────────
  private enfocarInputCodigo(): void {
    setTimeout(() => {
      this.inputCodigo?.nativeElement.focus();
      this.inputCodigo?.nativeElement.select();
    }, 0);
  }

  private enfocarInputCambio(): void {
    setTimeout(() => {
      this.inputCambio?.nativeElement.focus();
      this.inputCambio?.nativeElement.select();
    }, 0);
  }

  // ─── Agregar productos ───────────────────────────────────────────────────────
  agregarProductoPorCodigo(): void {
    const entrada = this.codigoProducto.trim();
    let cantidad = 1;
    let codigo = entrada;

    if (entrada.includes('*')) {
      const partes = entrada.split('*');
      if (partes.length === 2 && partes[0] && partes[1]) {
        cantidad = Number(partes[0]);
        codigo = partes[1].trim();
      } else {
        this.toastrService.error('Formato de multiplicación incorrecto.');
        this.limpiarInputCodigo();
        return;
      }
    }

    const producto = this.productosPorCodigo.get(codigo);
    if (!producto) {
      this.toastrService.error('Producto no encontrado.');
      this.limpiarInputCodigo();
      return;
    }

    if (!producto.unidadMedida.permiteDecimales && !Number.isInteger(cantidad)) {
      this.toastrService.error('El producto no es fraccionario.');
      this.limpiarInputCodigo();
      return;
    }

    this.agregarAlCarrito(producto, cantidad);
    this.limpiarInputCodigo();
  }

  private agregarAlCarrito(producto: ProductoSimpleResponseDto, cantidad: number): void {
    if (cantidad <= 0 || isNaN(cantidad)) {
      this.toastrService.error('Cantidad inválida.');
      return;
    }

    const stockDisponible = this.obtenerStockDisponible(producto.codigo);

    if (stockDisponible <= 0) {
      this.toastrService.error('Sin inventario disponible.');
      return;
    }

    if (cantidad > stockDisponible) {
      this.toastrService.error('Inventario insuficiente, la cantidad supera al stock.');
      return;
    }

    const itemExistente = this.carrito.find(item => item.producto.codigo === producto.codigo);
    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      this.carrito.push({ producto: { ...producto }, cantidad });
    }
  }

  // ─── Edición de cantidad ─────────────────────────────────────────────────────
  actualizarCantidadItem(index: number, nuevoValor: number | string): void {
    const item = this.carrito[index];
    if (!item) return;

    const cantidad = Number(nuevoValor);
    const maximo = this.obtenerMaximoPermitido(item.producto.codigo, index);

    if (isNaN(cantidad) || cantidad < 0) {
      this.toastrService.error('Cantidad inválida.');
      item.cantidad = item.cantidad; // fuerza repintado
      return;
    }

    if (!item.producto.unidadMedida.permiteDecimales && !Number.isInteger(cantidad)) {
      this.toastrService.error('El producto no es fraccionario.');
      return;
    }

    if (cantidad > maximo) {
      this.toastrService.error('Inventario insuficiente.');
      item.cantidad = maximo > 0 ? maximo : 1;
      return;
    }

    item.cantidad = cantidad;

    // Sincronizar el importe temporal si existe
    if (this.importesTemporales.has(index)) {
      const importe = this.redondear(item.cantidad * item.producto.precio, this.DECIMALES_DINERO);
      this.importesTemporales.set(index, String(importe));
    }
  }

  disminuirCantidad(index: number): void {
    const item = this.carrito[index];
    if (!item) return;

    const decremento = item.producto.unidadMedida.permiteDecimales ? 0.05 : 1;

    if (item.cantidad > decremento) {
      item.cantidad = this.redondear(item.cantidad - decremento, this.DECIMALES_DINERO);
    } else {
      this.carrito.splice(index, 1);
      this.importesTemporales.delete(index);
      // Re-indexar los temporales al eliminar un elemento del medio
      this.reindexarImportesTemporales(index);
    }

    this.enfocarInputCodigo();
  }

  // ─── Importe temporal (INPUT DESACOPLADO) ────────────────────────────────────
  /**
   * Retorna el valor que debe mostrar el input de importe.
   * Si el usuario está escribiendo, muestra su valor temporal.
   * Si no, calcula desde la cantidad actual.
   */
  obtenerImporteInputValue(index: number): string {
    if (this.importesTemporales.has(index)) {
      return this.importesTemporales.get(index)!;
    }
    const item = this.carrito[index];
    if (!item) return '0';
    return String(this.redondear(item.cantidad * item.producto.precio, this.DECIMALES_DINERO));
  }

  /**
   * Mientras el usuario escribe, solo actualiza el estado temporal.
   * NO recalcula la cantidad todavía.
   */
  onImporteInput(index: number, event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.importesTemporales.set(index, valor);
  }

  /**
   * Al salir del input (blur) o presionar Enter, aplica el importe como cantidad.
   */
  confirmarImporte(index: number, event?: Event): void {
    const item = this.carrito[index];
    if (!item) return;

    const valorStr = this.importesTemporales.get(index);
    if (valorStr === undefined) return;

    const importe = Number(valorStr);

    if (isNaN(importe) || importe < 0) {
      this.toastrService.error('Importe inválido.');
      this.importesTemporales.delete(index);
      return;
    }

    if (importe === 0) {
      this.toastrService.error('El importe debe ser mayor a cero.');
      this.importesTemporales.delete(index);
      return;
    }

    const maximo = this.obtenerMaximoPermitido(item.producto.codigo, index);
    let cantidadCalculada = this.redondear(importe / item.producto.precio, this.DECIMALES_CANTIDAD);

    if (cantidadCalculada > maximo) {
      this.toastrService.error('Inventario insuficiente para ese importe.');
      cantidadCalculada = maximo;
    }

    item.cantidad = cantidadCalculada;
    // Limpiar el temporal — el input ahora mostrará el valor calculado
    this.importesTemporales.delete(index);
  }

  onImporteKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.confirmarImporte(index, event);
      (event.target as HTMLInputElement).blur();
    }
  }

  // ─── Stock ────────────────────────────────────────────────────────────────────
  obtenerStockDisponible(codigo: string): number {
    const stockOriginal = this.stockOriginalPorCodigo.get(codigo) ?? 0;
    const enCarrito = this.carrito.reduce((total, item) =>
      item.producto.codigo === codigo ? total + item.cantidad : total, 0
    );
    return stockOriginal - enCarrito;
  }

  obtenerMaximoPermitido(codigo: string, excluirIndex: number): number {
    const stockOriginal = this.stockOriginalPorCodigo.get(codigo) ?? 0;
    const otrosEnCarrito = this.carrito.reduce((total, item, idx) =>
      item.producto.codigo === codigo && idx !== excluirIndex ? total + item.cantidad : total, 0
    );
    return stockOriginal - otrosEnCarrito;
  }

  // ─── Totales ──────────────────────────────────────────────────────────────────
  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad * item.producto.precio, 0);
  }

  calcularCambio(): number {
    const total = this.calcularTotal();
    return this.dineroRecibido > total ? this.dineroRecibido - total : 0;
  }

  // ─── Finalizar venta ─────────────────────────────────────────────────────────
  finalizarVenta(): void {
    if (!this.carrito.length) {
      this.toastrService.error('El carrito está vacío.');
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
        this.toastrService.success(`Venta ${response.folio} registrada con éxito!`, '¡Éxito!');
        this.cargarProductos();
        this.carrito = [];
        this.importesTemporales.clear();
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

  // ─── Utilidades privadas ─────────────────────────────────────────────────────
  private redondear(valor: number, decimales: number): number {
    return Number(valor.toFixed(decimales));
  }

  private limpiarInputCodigo(): void {
    this.codigoProducto = '';
    this.enfocarInputCodigo();
  }

  private reindexarImportesTemporales(indexEliminado: number): void {
    const nuevoMapa = new Map<number, string>();
    this.importesTemporales.forEach((valor, key) => {
      if (key > indexEliminado) {
        nuevoMapa.set(key - 1, valor);
      } else if (key < indexEliminado) {
        nuevoMapa.set(key, valor);
      }
    });
    this.importesTemporales = nuevoMapa;
  }
}