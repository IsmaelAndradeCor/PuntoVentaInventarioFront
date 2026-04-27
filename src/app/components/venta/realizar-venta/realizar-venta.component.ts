import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemCarrito } from '../../../models/item-carrito';
import { VentaDto } from '../../../models/venta';
import { VentaService } from '../../../services/venta.service';
import { ToastrService } from 'ngx-toastr';
import { ProductoResponseDto } from '../../../models/dtos/responses/producto-response-dto';

@Component({
  selector: 'app-realizar-venta',
  imports: [CommonModule, FormsModule],
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

  // productosDto: ProductoDto[] = [];
  productos: ProductoResponseDto[] = [];
  productosPorCodigo: Map<string, ProductoResponseDto> = new Map();  // ← Tu diccionario
  
  codigoProducto: string = '';
  dineroRecibido: number = 0;
  // cambioDar: number = 0;

  // carrito: ProductoDto[] = [];
  // Propiedad del carrito
  carrito: ItemCarrito[] = [];

  ngOnInit() {
    this.getProductos();
  }

  getProductos(): void {
    this.productoService.getProductos().subscribe({
      next:(prodcutosResponse) => {
        this.productos = prodcutosResponse;

        this.productosPorCodigo = new Map(
          this.productos.map(producto => [producto.codigo, producto])
        );
        
        console.log('Map creado con', this.productosPorCodigo.size, 'productos');
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
        return;
      }
    }

    if (codigo && this.productosPorCodigo.has(codigo)) {
      const producto = this.productosPorCodigo.get(codigo)!;
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

  agregarAlCarrito(producto: ProductoResponseDto, cantidad: number) {
    const productoStock = this.productosPorCodigo.get(producto.codigo);
    if (!productoStock || productoStock.stock <= 0) {
      this.toastrService.error('Sin inventario');
      return;
    }

    if (cantidad <= 0 || isNaN(Number(cantidad))) {
      this.toastrService.error('Cantidad inválida');
      return;
    }

    if (productoStock.stock < cantidad) {
      this.toastrService.error('Inventario insuficiciente, la cantidad supera al stock.');
      return;
    }

    const itemExistente = this.carrito.find(item => 
      item.producto.codigo === producto.codigo  // Ahora existe producto.codigo
    );

    productoStock.stock -= cantidad;

    if (itemExistente) {
      itemExistente.cantidad += cantidad;  // itemExistente tiene cantidad
    } else {
      this.carrito.push({ 
        producto: {...producto}, 
        cantidad: cantidad 
      });  // Crea ItemCarrito
    }
  }

  disminuirCantidad(index: number) {
    const item = this.carrito[index];

    if (!item) return;

    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      this.carrito.splice(index, 1);
    }

    // Agregamos la funcion de que cuando eliminamos un articulo del carrito aumente el stock
    const productoStock = this.productosPorCodigo.get(item.producto.codigo);
    productoStock!.stock ++;

    this.enfocarInputCodigo();
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => 
      total + (item.cantidad * item.producto.precio), 0
    );
  }

  calcularCambio(): number {
    const totalVenta = this.calcularTotal();

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
    const venta: VentaDto = {
      folio: this.generarFolio(),
      total: this.calcularTotal(),
      detalles: this.carrito.map(item => ({
        idProducto: item.producto.id,
        codigo: item.producto.codigo,
        nombre: item.producto.nombre,
        cantidad: item.cantidad,
        costo: item.producto.costo,
        precio: item.producto.precio
      }))
    };

    this.ventaService.registrarVenta(venta).subscribe({
      next:(idVenta) => {
        // console.log('Venta #' + idVenta + ' registrada exitosamente');
        this.toastrService.success('Venta registrada con éxito!','Éxito!')
        this.carrito = [];
        this.codigoProducto = '';
        this.enfocarInputCodigo();
        this.dineroRecibido = 0;
      },
      error:(error) => {
        this.toastrService.warning('Ocurrió un error, por favor contacta al administrador.','Error');
        this.enfocarInputCodigo();
        this.dineroRecibido = 0;
      },
      complete:() => {
      }
    });
  }
  
}

