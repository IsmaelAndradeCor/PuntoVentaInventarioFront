import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { ProductoResponseDto } from '../../models/dtos/responses/producto-response-dto';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(
    private productoService: ProductoService,
    public authService: AuthService,
    private toastrService: ToastrService
  ) {}

  productos: ProductoResponseDto[] = [];
  // ventas: GenerarVentasDTO [] = [];

  ngOnInit(): void {
    this.getProductosStockMinimo();
    // this.getGenerarVenta();
  }

  getProductosStockMinimo(): void {
    this.productoService.getProductosStockMinimo().subscribe({
      next:(res) => {
        this.productos = res;
      },
      error:() => {
        this.toastrService.error('Ocurrió un error al cargar el inventario con stock minimo, por favor contacta al Administrador.')
      }
    });
  }

  // getGenerarVenta(): void {
  //   this.ventaService.getGenerarVentas().subscribe({
  //     next:(res) => {
  //       this.ventas = res;
  //     }
  //   });
  // }

  // calcularTotalGanancias(): number {
  //   console.log('calcularTotalGanancias()');
  //   return this.ventas.reduce((total, item) => 
  //     total + (item.ganancias), 0
  //   );
  // }

}
