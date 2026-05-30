import { Component } from '@angular/core';
import { CorteCajaHoyResponseDto } from '../../../models/dtos/responses/corte-caja-hoy-response-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CajaService } from '../../../services/caja.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pagina-corte-caja',
  imports: [CommonModule, FormsModule],
  templateUrl: './pagina-corte-caja.component.html',
  styleUrl: './pagina-corte-caja.component.scss'
})
export class PaginaCorteCajaComponent {
  cargando = false;
  corte: CorteCajaHoyResponseDto | null = null;

  constructor(
    private cajaService: CajaService,
    private toastrService: ToastrService
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
      error: (err) => {
        this.cargando = false;
        this.toastrService.error(
          err?.error?.mensaje ?? 'No se pudo obtener el corte de caja.'
        );
      }
    });
  }
}
