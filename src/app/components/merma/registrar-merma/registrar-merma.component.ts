import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductoSimpleResponseDto } from '../../../models/dtos/responses/producto-simple-response-dto';
import { MermaService } from '../../../services/merma.service';
import { RegistrarMermaUpsertDto } from '../../../models/dtos/requests/registrar-merma-upsert-dto';

interface ItemMerma {
  producto: ProductoSimpleResponseDto;
  cantidad: number;
}

@Component({
  selector: 'app-registrar-merma',
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-merma.component.html',
  styleUrl: './registrar-merma.component.scss'
})
export class RegistrarMermaComponent implements OnInit {

  @ViewChild('inputCodigo') inputCodigo!: ElementRef<HTMLInputElement>;

  constructor(
    private productoService: ProductoService,
    private mermaService: MermaService,
    private toastrService: ToastrService
  ) {}

  productos: ProductoSimpleResponseDto[] = [];
  productosPorCodigo: Map<string, ProductoSimpleResponseDto> = new Map();
  stockOriginalPorCodigo: Map<string, number> = new Map();

  codigoProducto: string = '';
  codigoProductoNombre: string = '';
  carrito: ItemMerma[] = [];
  observaciones: string = '';

  private readonly DECIMALES_CANTIDAD = 4;

  ngOnInit(): void {
    this.cargarProductos();
  }

  ngAfterViewInit(): void {
    this.enfocarInputCodigo();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(event: Event): void {
    event.preventDefault();
    this.enfocarInputCodigo();
  }

  @HostListener('document:keydown.control.enter', ['$event'])
  onCtrlEnter(event: Event): void {
    event.preventDefault();
    this.registrarMerma();
  }

  private cargarProductos(): void {
    this.productoService.getProductosVenta().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.productosPorCodigo = new Map(productos.map(p => [p.codigo, p]));
        this.stockOriginalPorCodigo = new Map(productos.map(p => [p.codigo, p.stock]));
      }
    });
  }

  private enfocarInputCodigo(): void {
    setTimeout(() => {
      this.inputCodigo?.nativeElement.focus();
      this.inputCodigo?.nativeElement.select();
    }, 0);
  }

  agregarProductoPorCodigo(): void {
    const entrada = (this.codigoProducto || this.codigoProductoNombre || '').trim();

    if (!entrada) {
      this.toastrService.error('Escanea o escribe un producto.');
      this.limpiarInputCodigo();
      return;
    }

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

  actualizarCantidadItem(index: number, nuevoValor: number | string): void {
    const item = this.carrito[index];
    if (!item) return;

    const cantidad = Number(nuevoValor);
    const maximo = this.obtenerMaximoPermitido(item.producto.codigo, index);

    if (isNaN(cantidad) || cantidad < 0) {
      this.toastrService.error('Cantidad inválida.');
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
  }

  eliminarItem(index: number): void {
    this.carrito.splice(index, 1);
  }

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

  calcularCostoTotal(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad * item.producto.costo, 0);
  }

  registrarMerma(): void {
    if (!this.carrito.length) {
      this.toastrService.error('El carrito está vacío.');
      return;
    }

    const merma: RegistrarMermaUpsertDto = {
      detalles: this.carrito.map(item => ({
        idProducto: item.producto.id,
        cantidad: item.cantidad
      })),
      observaciones: this.observaciones.trim() || undefined
    };

    this.mermaService.registrarMerma(merma).subscribe({
      next: (response) => {
        this.toastrService.success(`Merma ${response.folio} registrada con éxito!`, '¡Éxito!');
        this.cargarProductos();
        this.carrito = [];
        this.observaciones = '';
        this.limpiarInputCodigo();
      },
      error: () => {
        this.limpiarInputCodigo();
      }
    });
  }

  private limpiarInputCodigo(): void {
    this.codigoProducto = '';
    this.codigoProductoNombre = '';
    this.enfocarInputCodigo();
  }
}
