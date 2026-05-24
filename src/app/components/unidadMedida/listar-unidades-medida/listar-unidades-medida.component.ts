import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActualizarUnidadMedidaComponent } from '../actualizar-unidad-medida/actualizar-unidad-medida.component';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { UnidadMedidaService } from '../../../services/unidad-medida.service';
import { ToastrService } from 'ngx-toastr';
import { UnidadMedidaResponseDto } from '../../../models/dtos/responses/unidad-medida-response-dto';
import { HasPermissionDirective } from "../../../core/directives/has-permission.directive";

@Component({
  selector: 'app-listar-unidades-medida',
  imports: [CommonModule, FormsModule, ActualizarUnidadMedidaComponent, ConfirmarModalComponent, HasPermissionDirective],
  templateUrl: './listar-unidades-medida.component.html',
  styleUrl: './listar-unidades-medida.component.scss'
})
export class ListarUnidadesMedidaComponent {

  constructor(private unidadMedidaService: UnidadMedidaService,
              private toastrService: ToastrService
  ) { }

  unidadesMedida: UnidadMedidaResponseDto[] = [];
  unidadesMedidaFiltradas: UnidadMedidaResponseDto[] = [];
  objetoActualizar: UnidadMedidaResponseDto | null = null;

  idDesactivar: number | null = null;
  nombreDesactivar: string = '';

  mostrarActualizar: boolean = false;
  mostrarDesactivar: boolean = false;

  textoBusqueda: string = '';

  ngOnInit(): void {
    this.getUnidadesMedidaActivas();
  }

  getUnidadesMedidaActivas(): void {
    this.unidadMedidaService.getUnidadesMedidaActivas().subscribe({
      next: (response) => {
        this.unidadesMedida = response;
        this.unidadesMedidaFiltradas = [...this.unidadesMedida];
      }
    });
  }

  mostrarModalActualizarPorId(idUnidadMedida: number): void {
    this.unidadMedidaService.getUnidadMedida(idUnidadMedida).subscribe({
      next: (response) => {
        this.objetoActualizar = response;
        this.mostrarActualizar = true;
      }
    });
  }

  cerrarModalActualizar(): void {
    this.mostrarActualizar = false;
    this.objetoActualizar = null;
  }

  actualizarEnLista(unidadMedidaActualizada: UnidadMedidaResponseDto): void {
    const index = this.unidadesMedida.findIndex(x => x.id === unidadMedidaActualizada.id);

    if (index !== -1) {
      this.unidadesMedida[index] = unidadMedidaActualizada;
      this.unidadesMedidaFiltradas = [...this.unidadesMedida];
      this.filtrarTabla();
    }

    this.cerrarModalActualizar();
  }

  mostrarModalConfirmarDesactivar(idUnidadMedida: number): void {
    this.idDesactivar = idUnidadMedida;
    this.nombreDesactivar = this.unidadesMedida.find((i) => i.id === idUnidadMedida)?.nombre ?? '';
    this.mostrarDesactivar = true;
  }

  desactivarPorId(idUnidadMedida: number): void {
    this.unidadMedidaService.deactivateUnidadMedida(idUnidadMedida).subscribe({
      next:() => {
        this.unidadesMedida = this.unidadesMedida.filter(x => x.id !== idUnidadMedida);
        this.filtrarTabla();

        this.toastrService.success('Unidad de Medida desactivada con éxito');
      }
    })
  }

  cerrarModalConfirmar(): void {
    this.mostrarDesactivar = false;
    this.idDesactivar = null;
    this.nombreDesactivar = '';
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
