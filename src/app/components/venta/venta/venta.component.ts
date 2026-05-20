import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GenerarVentasDTO } from '../../../models/generar-ventas-dto';
import { VentaService } from '../../../services/venta.service';

@Component({
  selector: 'app-venta',
  imports: [CommonModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.scss'
})
export class VentaComponent implements OnInit {

  constructor(private ventaService: VentaService){}

  ventas: GenerarVentasDTO [] = [];

  ngOnInit(): void {
    this.getGenerarVenta();
  }
  
  getGenerarVenta(): void {
    this.ventaService.getGenerarVentas().subscribe({
      next:(res) => {
        this.ventas = res;
      }
    });
  }

  calcularTotalGanancias(): number {
    // console.log('calcularTotalGanancias()');
    return this.ventas.reduce((total, item) => 
      total + (item.ganancias), 0
    );
  }
}
