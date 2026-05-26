import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoriaService } from '../../../services/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { CategoriaResponseDto } from '../../../models/dtos/responses/categoria-response-dto';
import { CategoriaUpsertDto } from '../../../models/dtos/requests/categoria-upsert-dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actualizar-categoria',
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-categoria.component.html',
  styleUrl: './actualizar-categoria.component.scss'
})
export class ActualizarCategoriaComponent implements OnInit {

  constructor(private categoriaService: CategoriaService,
              private toastrService: ToastrService
  ){}

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() objetoActualizado = new EventEmitter<CategoriaResponseDto>();

  @Input() objetoActualizar: CategoriaResponseDto | null = null;
  @Input() mostrarActualizar = false;

  ngOnInit(): void {
    this.categoriaNombre = this.objetoActualizar?.nombre!;
  }

  categoriaUpsert: CategoriaUpsertDto = {
    nombre: ''
  }

  categoriaNombre: string = '';

  cerrar() {
    this.cerrarModal.emit();  // Emite evento al padre
  }

  guardarCambios() {
    if (this.objetoActualizar) {
      this.categoriaUpsert.nombre = this.categoriaNombre;

      this.categoriaService.putCategoria(this.objetoActualizar.id, this.categoriaUpsert).subscribe({
        next:(response) => {
          this.objetoActualizar = response;
          this.toastrService.success('Categoria actualizada correctamente!');
          this.objetoActualizado.emit(response);
          this.cerrarModal.emit();
        },
        error:(response) => {
          this.toastrService.error('Ocurrió un error al actualizar la Categoria, por favor contacta al administrador.');
        }
      })
    }
  }
}
