import { Component } from '@angular/core';
import { CategoriaService } from '../../../services/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriaResponseDto } from '../../../models/dtos/responses/categoria-response-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';

@Component({
  selector: 'app-listar-categorias-inactivas',
  imports: [CommonModule, FormsModule, ConfirmarModalComponent, HasPermissionDirective],
  templateUrl: './listar-categorias-inactivas.component.html',
  styleUrl: './listar-categorias-inactivas.component.scss'
})
export class ListarCategoriasInactivasComponent {

  constructor(private categoriaService: CategoriaService,
              private toastrService: ToastrService
  ) { }

  categorias: CategoriaResponseDto[] = [];
  categoriasFiltradas: CategoriaResponseDto[] = [];

  idActivar: number | null = null;
  nombreActivar: string = '';

  mostrarActualizar: boolean = false;
  mostrarActivar: boolean = false;

  textoBusqueda: string = '';

  ngOnInit(): void {
    this.getCategoriasActivas();
  }

  getCategoriasActivas(): void {
    this.categoriaService.getCategoriasInactivas().subscribe({
      next: (response) => {
        this.categorias = response;
        this.categoriasFiltradas = [...this.categorias];
      }
    });
  }
  mostrarModalConfirmarActivar(idCategoria: number): void {
    this.idActivar = idCategoria;
    this.nombreActivar = this.categorias.find((i) => i.id === idCategoria)?.nombre ?? '';
    this.mostrarActivar = true;
  }

  activarPorId(idCategoria: number): void {
    this.categoriaService.activateCategoria(idCategoria).subscribe({
      next:() => {
        this.categorias = this.categorias.filter(x => x.id !== idCategoria);
        this.filtrarTabla();

        this.toastrService.success('Categoria activada con éxito');
      },
      error: (error) => {
        // this.toastrService.error('Ocurrió un error al activar la Categoria, por favor contacte al administrador.');
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
