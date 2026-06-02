import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CajaService } from '../../../services/caja.service';
import { CorteCajaHoyResponseDto, CorteRealizadoDto } from '../../../models/dtos/responses/corte-caja-hoy-response-dto';
import { CorteCajaResponseDto } from '../../../models/dtos/responses/corte-caja-response-dto';
import { CorteCajaModalComponent } from '../../../modals/corte-caja-modal/corte-caja-modal.component';
import { AperturaCajaModalComponent } from '../../../modals/apertura-caja-modal/apertura-caja-modal.component';

@Component({
  selector: 'app-pagina-corte-caja',
  imports: [CommonModule, FormsModule, CorteCajaModalComponent, AperturaCajaModalComponent],
  templateUrl: './pagina-corte-caja.component.html',
  styleUrl: './pagina-corte-caja.component.scss'
})
export class PaginaCorteCajaComponent implements OnInit {
  cargando = false;
  corte: CorteCajaHoyResponseDto | null = null;
  mostrarModalCorte = false;
  mostrarModalAperturaCaja = false;
  corteExpandidoId: number | null = null;

  constructor(
    private cajaService: CajaService
  ) {}

  ngOnInit(): void {
    this.cargarCorte();
  }

  cargarCorte(): void {
    this.cargando = true;

    this.cajaService.obtenerCorteHoy().subscribe({
      next: (response) => {
        this.corte = response;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  abrirModalCorte(): void {
    this.mostrarModalCorte = true;
  }

  onCorteRealizado(_response: CorteCajaResponseDto): void {
    this.mostrarModalCorte = false;
    this.cargarCorte();
  }

  cerrarModalCorte(): void {
    this.mostrarModalCorte = false;
  }

  abrirModalAperturaCaja(): void {
    this.mostrarModalAperturaCaja = true;
  }

  cerrarModalAperturaCaja(): void {
    this.mostrarModalAperturaCaja = false;
  }

  onAperturaRegistrada(): void {
    this.mostrarModalAperturaCaja = false;
    this.cargarCorte();
  }

  toggleDetalle(id: number): void {
    this.corteExpandidoId = this.corteExpandidoId === id ? null : id;
  }

  estaExpandido(id: number): boolean {
    return this.corteExpandidoId === id;
  }
}
