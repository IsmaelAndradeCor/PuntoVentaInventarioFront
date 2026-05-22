import { Component } from '@angular/core';
import { MarcaService } from '../../../services/marca.service';
import { ToastrService } from 'ngx-toastr';
import { MarcaResponseDto } from '../../../models/dtos/responses/marca-response-dto';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { FormsModule } from '@angular/forms';
import { HasPermissionDirective } from "../../../core/directives/has-permission.directive";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listar-marcas-inactivas',
  imports: [ConfirmarModalComponent, CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './listar-marcas-inactivas.component.html',
  styleUrl: './listar-marcas-inactivas.component.scss'
})
export class ListarMarcasInactivasComponent {

  constructor(private marcaService: MarcaService,
              private toastrService: ToastrService
  ){}

  marcas: MarcaResponseDto[] = [];
  marcasFiltradas: MarcaResponseDto[] = [];

  idActivar: number | null = null;
  nombreActivar: string = '';
  mostrarActivar: boolean = false;
  textoBusqueda: string = '';

  ngOnInit(): void {
    this.getMarcasInactivas();
  }

  getMarcasInactivas(): void {
    this.marcaService.getMarcasInactivas().subscribe({
      next:(response) => {
        this.marcas = response;
        this.marcasFiltradas = [... this.marcas];
      }
    })
  }

  mostrarModalConfirmarActivar(idMarca: number): void {
    this.idActivar = idMarca;
    this.nombreActivar = this.marcas.find((i) => i.id === idMarca)?.nombre ?? '';
    this.mostrarActivar = true;
  }

  activarPorId(idMarca: number): void {
    this.marcaService.activateMarca(idMarca).subscribe({
      next:() => {
        this.marcas = this.marcas.filter(x => x.id !== idMarca);
        this.filtrarTabla();

        this.toastrService.success('Marca activada con éxito');
      },
      error: (error) => {
        // this.toastrService.error('Ocurrió un error al activar la Marca, por favor contacte al administrador.');
      }
    })
  }

  cerrarModalConfirmar(): void {
    this.mostrarActivar = false;
    this.idActivar = null;
    this.nombreActivar = '';
  }

  filtrarTabla(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();

    if (!texto) {
      this.marcasFiltradas = [...this.marcas];
      return;
    }

    this.marcasFiltradas = this.marcas.filter(x =>
      x.nombre.toLowerCase().includes(texto)
    );
  }

  limpiarTextoBusqueda(): void {
    this.textoBusqueda = '';
    this.filtrarTabla();
  }
}
