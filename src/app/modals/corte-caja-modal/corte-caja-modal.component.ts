import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CajaService } from '../../services/caja.service';
import { UsuarioService } from '../../services/usuario.service';
import { CorteCajaResponseDto } from '../../models/dtos/responses/corte-caja-response-dto';
import { RealizarCorteUpsertDto } from '../../models/dtos/requests/realizar-corte-upsert-dto';
import { UsuarioPermisosResponseDto } from '../../models/dtos/responses/usuario-permisos-response-dto';

@Component({
  selector: 'app-corte-caja-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './corte-caja-modal.component.html',
  styleUrl: './corte-caja-modal.component.scss'
})
export class CorteCajaModalComponent implements OnInit, OnChanges {
  @Input() mostrar = false;
  @Input() montoEsperado = 0;
  @Input() montoInicial = 0;
  @Input() montoVentas = 0;
  @Input() montoPagoProveedores = 0;

  @Output() corteRealizado = new EventEmitter<CorteCajaResponseDto>();
  @Output() cerrar = new EventEmitter<void>();

  retiro = 0;
  montoFinal = 0;
  esCorteFinal = false;
  observaciones = '';
  guardando = false;
  usuarios: UsuarioPermisosResponseDto[] = [];
  idUsuarioRecepcion = '';
  cargandoUsuarios = false;

  constructor(
    private cajaService: CajaService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mostrar']) {
      const prev = changes['mostrar'].previousValue;
      const curr = changes['mostrar'].currentValue;
      if (curr && !prev) {
        this.inicializarValores();
      }
    }
  }

  private inicializarValores(): void {
    this.montoFinal = this.montoEsperado;
    this.retiro = 0;
    this.esCorteFinal = false;
    this.idUsuarioRecepcion = '';
    this.observaciones = '';
    this.guardando = false;
  }

  get usuariosFiltrados(): UsuarioPermisosResponseDto[] {
    return this.usuarios.filter(u =>
      u.activo &&
      (u.permissions.includes('ventas.ver') ||
       u.permissions.includes('ventas.realizar'))
    );
  }

  private cargarUsuarios(): void {
    this.cargandoUsuarios = true;
    this.usuarioService.getUsuariosActivos().subscribe({
      next: (users) => {
        this.usuarios = users;
        this.cargandoUsuarios = false;
      },
      error: () => {
        this.cargandoUsuarios = false;
      }
    });
  }

  onRetiroChange(): void {
    if (this.retiro > this.montoEsperado) {
      this.retiro = this.montoEsperado;
    }
    if (this.retiro < 0) {
      this.retiro = 0;
    }
    this.montoFinal = this.montoEsperado - this.retiro;
    this.esCorteFinal = this.retiro >= this.montoEsperado;
    if (this.esCorteFinal) {
      this.idUsuarioRecepcion = '';
    }
  }

  onMontoFinalChange(): void {
    if (this.montoFinal > this.montoEsperado) {
      this.montoFinal = this.montoEsperado;
    }
    if (this.montoFinal < 0) {
      this.montoFinal = 0;
    }
    this.retiro = this.montoEsperado - this.montoFinal;
    this.esCorteFinal = this.montoFinal <= 0;
    if (this.esCorteFinal) {
      this.idUsuarioRecepcion = '';
    }
  }

  guardar(): void {
    if (!this.esCorteFinal && !this.idUsuarioRecepcion) {
      this.toastr.warning('Debes seleccionar a qué usuario se le entrega la caja.');
      return;
    }

    this.guardando = true;

    const request: RealizarCorteUpsertDto = {
      retiro: this.retiro,
      observaciones: this.observaciones.trim() || undefined
    };

    if (!this.esCorteFinal) {
      request.idUsuarioRecepcion = this.idUsuarioRecepcion;
    }

    this.cajaService.realizarCorte(request).subscribe({
      next: response => {
        this.guardando = false;
        this.corteRealizado.emit(response);
        const msg = response.corteFinal
          ? 'Corte final del día realizado. La caja ha quedado cerrada.'
          : 'Corte de caja realizado correctamente.';
        this.toastr.success(msg);
      },
      error: () => {
        this.guardando = false;
      }
    });
  }

  getNombreRecepcion(): string {
    const user = this.usuarios.find(u => u.id === this.idUsuarioRecepcion);
    return user ? user.nombreCompleto : 'el siguiente turno';
  }

  cancelar(): void {
    this.cerrar.emit();
  }
}
