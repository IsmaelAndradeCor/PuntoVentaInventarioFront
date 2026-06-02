import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CajaService } from '../../services/caja.service';

@Component({
  selector: 'app-apertura-caja-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apertura-caja-modal.component.html',
  styleUrl: './apertura-caja-modal.component.scss'
})
export class AperturaCajaModalComponent {
  @Input() mostrarAperturaCaja = false;

  @Output() aperturaRegistrada = new EventEmitter<void>();
  @Output() cerrar = new EventEmitter<void>();

  montoInicial = 0;
  guardando = false;

  cerrarModal(): void {
    this.cerrar.emit();
  }

  constructor(
    private cajaService: CajaService,
    private toastr: ToastrService
  ) {}

  guardar(): void {
    if (this.montoInicial < 0) {
      this.toastr.warning('El monto inicial debe ser mayor o igual a 0.');
      return;
    }

    this.guardando = true;

    this.cajaService.registrarApertura({ montoInicial: this.montoInicial }).subscribe({
      next: response => {
        this.guardando = false;
        this.aperturaRegistrada.emit();
        this.toastr.success('Apertura de caja registrada correctamente.');
      },
      error: () => {
        this.guardando = false;
      }
    });
  }
}