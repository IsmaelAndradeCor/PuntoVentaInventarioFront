import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { ProductoResponseDto } from '../../models/dtos/responses/producto-response-dto';
import { AuthService } from '../../core/auth/auth.service';
import { CajaService } from '../../services/caja.service';
import { AperturaCajaModalComponent } from '../../modals/apertura-caja-modal/apertura-caja-modal.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, AperturaCajaModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private cajaService: CajaService
  ) {}

  productos: ProductoResponseDto[] = [];
  usarioNombreCompleto: string = '';
  mostrarAperturaCaja: boolean = false;

  ngOnInit(): void {
    this.getProductosStockMinimo();
    this.validarAperturaCaja();
    this.usarioNombreCompleto = this.authService.nombreCompleto();
  }

  getProductosStockMinimo(): void {
    this.productoService.getProductosStockMinimo().subscribe({
      next:(res) => {
        this.productos = res;
      }
    });
  }

  private validarAperturaCaja(): void {
    this.cajaService.obtenerAperturaHoy().subscribe({
      next: () => {},
      error: err => {
        if (err.status === 404) {
          this.mostrarAperturaCaja = true;
        }
      }
    });
  }

  cerrarModalAperturaCaja() {
    this.mostrarAperturaCaja = false;
  }
}
