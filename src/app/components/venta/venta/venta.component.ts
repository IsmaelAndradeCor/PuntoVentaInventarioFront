import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../../services/venta.service';
import { GenerarVentaResponseDto } from '../../../models/dtos/responses/generar-venta-response-dto';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-venta',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.scss'
})
export class VentaComponent implements OnInit {

  constructor(private ventaService: VentaService, private fb: FormBuilder){}

  filtroForm!: FormGroup;
  ventas: GenerarVentaResponseDto[] = [];
  ventaExpandidaId: number | null = null;
  cargando = false;

  ngOnInit(): void {
    const hoy = new Date().toISOString().split('T')[0];

    this.filtroForm = this.fb.group({
      fechaInicio: [hoy],
      fechaFin: [hoy],
      incluirDetalle: [true]
    });

    this.buscarVentas();
  }

  buscarVentas(): void {
    const filtros = this.filtroForm.value;

    this.cargando = true;
    this.ventaExpandidaId = null;

    this.ventaService.getGenerarVentas({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      incluirDetalle: filtros.incluirDetalle
    }).subscribe({
      next: (resp: GenerarVentaResponseDto[]) => {
        this.ventas = resp ?? [];
        this.cargando = false;
      }
    });
  }

  toggleDetalle(venta: GenerarVentaResponseDto): void {
    if (!this.filtroForm.get('incluirDetalle')?.value) {
      return;
    }

    this.ventaExpandidaId = this.ventaExpandidaId === venta.idVenta
      ? null
      : venta.idVenta;
  }

  estaExpandida(venta: GenerarVentaResponseDto): boolean {
    return this.ventaExpandidaId === venta.idVenta;
  }

  trackByVenta(index: number, venta: GenerarVentaResponseDto): number {
    return venta.idVenta;
  }

  calcularTotalGanancias(): number {
    return this.ventas.reduce((total, venta) => total + venta.ganancias, 0);
  }

  calcularTotalVentas(): number {
    return this.ventas.reduce((total, venta) => total + venta.total, 0);
  }
}
