import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MermaService } from '../../../services/merma.service';
import { MermaResponseDto } from '../../../models/dtos/responses/merma-response-dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-historial-merma',
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-merma.component.html',
  styleUrl: './historial-merma.component.scss'
})
export class HistorialMermaComponent implements OnInit {

  constructor(
    private mermaService: MermaService,
    private toastrService: ToastrService
  ) {}

  mermas: MermaResponseDto[] = [];
  mermasFiltradas: MermaResponseDto[] = [];
  textoBusqueda: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  mermaExpandida: number | null = null;

  ngOnInit(): void {
    const fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());
    const hoy = fecha.toISOString().split('T')[0];

    this.fechaInicio = hoy;
    this.fechaFin = hoy;
    this.getMermas();
  }

  getMermas(): void {
    const inicio = this.fechaInicio || undefined;
    const fin = this.fechaFin || undefined;

    this.mermaService.getMermas(inicio, fin).subscribe({
      next: (response) => {
        this.mermas = response;
        this.mermasFiltradas = [...this.mermas];
        this.mermaExpandida = null;
      },
      error: () => {}
    });
  }

  filtrarTabla(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();

    if (!texto) {
      this.mermasFiltradas = [...this.mermas];
      return;
    }

    this.mermasFiltradas = this.mermas.filter(x =>
      x.folio.toLowerCase().includes(texto) ||
      x.detalles.some(d => d.nombreProducto.toLowerCase().includes(texto) || d.codigoProducto.toLowerCase().includes(texto))
    );
  }

  limpiarFiltros(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.textoBusqueda = '';
    this.getMermas();
  }

  toggleDetalle(idMerma: number): void {
    this.mermaExpandida = this.mermaExpandida === idMerma ? null : idMerma;
  }
}
