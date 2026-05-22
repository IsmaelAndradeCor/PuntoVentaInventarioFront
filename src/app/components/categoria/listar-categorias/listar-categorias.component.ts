import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../../services/categoria.service';
import { CategoriaResponseDto } from '../../../models/dtos/responses/categoria-response-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { ToastrService } from 'ngx-toastr';
import { HasPermissionDirective } from "../../../core/directives/has-permission.directive";

@Component({
  selector: 'app-listar-categorias',
  imports: [CommonModule, FormsModule, ConfirmarModalComponent, HasPermissionDirective],
  templateUrl: './listar-categorias.component.html',
  styleUrl: './listar-categorias.component.scss'
})
export class ListarCategoriaComponent implements OnInit {

  constructor(private categoriaService: CategoriaService,
              private toastrService: ToastrService
  ) { }

  categorias: CategoriaResponseDto[] = [];
  categoriasFiltradas: CategoriaResponseDto[] = [];
  objetoActualizar: CategoriaResponseDto | null = null;

  idDesactivar: number | null = null;
  nombreDesactivar: string = '';

  mostrarActualizar: boolean = false;
  mostrarDesactivar: boolean = false;

  textoBusqueda: string = '';

  ngOnInit(): void {
    this.getCategoriasActivas();
  }

  getCategoriasActivas(): void {
    this.categoriaService.getCategoriasActivas().subscribe({
      next: (response) => {
        this.categorias = response;
        this.categoriasFiltradas = [...this.categorias];
      }
    });
  }

  mostrarModalActualizarPorId(idCategoria: number): void {
    this.categoriaService.getCategoria(idCategoria).subscribe({
      next: (response) => {
        this.objetoActualizar = response;
        this.mostrarActualizar = true;
      },
      error: (error) => {
        // this.toastrService.error('Ocurrió un error al buscar la Categoria, por favor contacte al administrador.');
      }
    });
  }

  cerrarModalActualizar(): void {
    this.mostrarActualizar = false;
    this.objetoActualizar = null;
  }

  actualizarEnLista(categoriaActualizada: CategoriaResponseDto): void {
    const index = this.categorias.findIndex(x => x.id === categoriaActualizada.id);

    if (index !== -1) {
      this.categorias[index] = categoriaActualizada;
      this.categoriasFiltradas = [...this.categorias];
      this.filtrarTabla();
    }

    this.cerrarModalActualizar();
  }

  mostrarModalConfirmarDesactivar(idCategoria: number): void {
    this.idDesactivar = idCategoria;
    this.nombreDesactivar = this.categorias.find((i) => i.id === idCategoria)?.nombre ?? '';
    this.mostrarDesactivar = true;
  }

  desactivarPorId(idCategoria: number): void {
    this.categoriaService.deactivateCategoria(idCategoria).subscribe({
      next:() => {
        this.categorias = this.categorias.filter(x => x.id !== idCategoria);
        this.filtrarTabla();

        this.toastrService.success('Categoria desactivada con éxito');
      },
      error: (error) => {
        // this.toastrService.error('Ocurrió un error al desactivar la Categoria, por favor contacte al administrador.');
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
      this.categoriasFiltradas = [...this.categorias];
      return;
    }

    this.categoriasFiltradas = this.categorias.filter(x =>
      x.nombre.toLowerCase().includes(texto)
    );
  }

  limpiarTextoBusqueda(): void {
    this.textoBusqueda = '';
    this.filtrarTabla();
  }

  categoriaCreada(categoriaCreada: CategoriaResponseDto): void {
    this.categorias.push(categoriaCreada);
    this.filtrarTabla();
  }
}
