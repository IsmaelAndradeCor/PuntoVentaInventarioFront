import { Component, OnInit } from '@angular/core';
import { CrearMarcaComponent } from '../crear-marca/crear-marca.component';
import { ActualizarMarcaComponent } from '../actualizar-marca/actualizar-marca.component';
import { MarcaService } from '../../../services/marca.service';
import { MarcaResponseDto } from '../../../models/dtos/responses/marca-response-dto';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listar-marcas',
  imports: [CrearMarcaComponent, ActualizarMarcaComponent, ConfirmarModalComponent, CommonModule, FormsModule],
  templateUrl: './listar-marcas.component.html',
  styleUrl: './listar-marcas.component.scss'
})
export class ListarMarcasComponent implements OnInit {

  constructor(private marcaService: MarcaService,
              private toastrService: ToastrService
  ){}

  marcas: MarcaResponseDto[] = [];
  marcasFiltradas: MarcaResponseDto[] = [];
  objetoActualizar: MarcaResponseDto | null = null;

  idDesactivar: number | null = null;
  nombreDesactivar: string = '';

  mostrarActualizar: boolean = false;
  mostrarDesactivar: boolean = false;

  textoBusqueda: string = '';

  ngOnInit(): void {
    this.getMarcasActivas();
  }

  getMarcasActivas(): void {
    this.marcaService.getMarcasActivas().subscribe({
      next:(response) => {
        this.marcas = response;
        this.marcasFiltradas = [... this.marcas];
      }
    })
  }

  mostrarModalActualizarPorId(idMarca: number): void {
    this.marcaService.getMarca(idMarca).subscribe({
      next: (marca) => {
        this.objetoActualizar = marca;
        this.mostrarActualizar = true;
      },
      error: (error) => {
        this.toastrService.error('Ocurrió un error al buscar la Marca, por favor contacte al administrador.');
      }
    });
  }

  cerrarModalActualizar(): void {
    this.mostrarActualizar = false;
    this.objetoActualizar = null;
  }

  actualizarEnLista(objetoActualizado: MarcaResponseDto): void {
    const index = this.marcas.findIndex(m => m.id === objetoActualizado.id);

    if (index !== -1) {
      this.marcas[index] = objetoActualizado;
      this.marcasFiltradas = [...this.marcas];
      this.filtrarTabla();
    }

    this.cerrarModalActualizar();
  }

  mostrarModalConfirmarDesactivar(idMarca: number): void {
    this.idDesactivar = idMarca;
    this.nombreDesactivar = this.marcas.find((i) => i.id === idMarca)?.nombre ?? '';
    this.mostrarDesactivar = true;
  }

  desactivarPorId(idMarca: number): void {
    this.marcaService.deactivateMarca(idMarca).subscribe({
      next:() => {
        this.marcas = this.marcas.filter(x => x.id !== idMarca);
        this.filtrarTabla();

        this.toastrService.success('Marca desactivada con éxito');
      },
      error: (error) => {
        this.toastrService.error('Ocurrió un error al desactivar la Marca, por favor contacte al administrador.');
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

  marcaCreada(marcaCreada: MarcaResponseDto): void {
    this.marcas.push(marcaCreada);
    this.filtrarTabla();
  }
}
