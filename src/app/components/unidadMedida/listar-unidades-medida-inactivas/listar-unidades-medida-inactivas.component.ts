import { Component } from '@angular/core';
import { UnidadMedidaService } from '../../../services/unidad-medida.service';
import { ToastrService } from 'ngx-toastr';
import { UnidadMedidaResponseDto } from '../../../models/dtos/responses/unidad-medida-response-dto';
import { HasPermissionDirective } from "../../../core/directives/has-permission.directive";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';

@Component({
  selector: 'app-listar-unidades-medida-inactivas',
  imports: [HasPermissionDirective, CommonModule, FormsModule, ConfirmarModalComponent],
  templateUrl: './listar-unidades-medida-inactivas.component.html',
  styleUrl: './listar-unidades-medida-inactivas.component.scss'
})
export class ListarUnidadesMedidaInactivasComponent {
  constructor(private unidadMedidaService: UnidadMedidaService,
              private toastrService: ToastrService
  ) { }

  unidadesMedida: UnidadMedidaResponseDto[] = [];
  unidadesMedidaFiltradas: UnidadMedidaResponseDto[] = [];

  idActivar: number | null = null;
  nombreActivar: string = '';

  mostrarActivar: boolean = false;

  textoBusqueda: string = '';

  ngOnInit(): void {
    this.getUnidadesMedidaInactivas();
  }

  getUnidadesMedidaInactivas(): void {
    this.unidadMedidaService.getUnidadesMedidaInactivas().subscribe({
      next: (response) => {
        this.unidadesMedida = response;
        this.unidadesMedidaFiltradas = [...this.unidadesMedida];
      }
    });
  }

  mostrarModalConfirmarActivar(idUnidadMedida: number): void {
    this.idActivar = idUnidadMedida;
    this.nombreActivar = this.unidadesMedida.find((i) => i.id === idUnidadMedida)?.nombre ?? '';
    this.mostrarActivar = true;
  }

  activarPorId(idUnidadMedida: number): void {
    this.unidadMedidaService.deactivateUnidadMedida(idUnidadMedida).subscribe({
      next:() => {
        this.unidadesMedida = this.unidadesMedida.filter(x => x.id !== idUnidadMedida);
        this.filtrarTabla();

        this.toastrService.success('Unidad de Medida desactivada con éxito');
      }
    });
  }

  cerrarModalConfirmar(): void {
    this.mostrarActivar = false;
    this.idActivar = null;
    this.nombreActivar = '';
  }

  filtrarTabla(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();

    if (!texto) {
      this.unidadesMedidaFiltradas = [...this.unidadesMedida];
      return;
    }

    this.unidadesMedidaFiltradas = this.unidadesMedida.filter(x =>
      x.nombre.toLowerCase().includes(texto)
    );
  }

  limpiarTextoBusqueda(): void {
    this.textoBusqueda = '';
    this.filtrarTabla();
  }

}
