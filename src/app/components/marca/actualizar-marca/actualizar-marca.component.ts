import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MarcaUpsertDto } from '../../../models/dtos/requests/marca-upsert-dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarcaResponseDto } from '../../../models/dtos/responses/marca-response-dto';
import { MarcaService } from '../../../services/marca.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-actualizar-marca',
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-marca.component.html',
  styleUrl: './actualizar-marca.component.scss'
})
export class ActualizarMarcaComponent implements OnInit {

  constructor(private marcaService: MarcaService,
              private toastrService: ToastrService
  ){}

  @Output() cerrarModal = new EventEmitter<void>();  // ← Output correcto para cerrar
  @Output() objetoActualizado = new EventEmitter<MarcaResponseDto>();

  @Input() objetoActualizar: MarcaResponseDto | null = null;
  @Input() mostrarActualizar = false;

  ngOnInit(): void {
    this.marcaNombre = this.objetoActualizar?.nombre!;
  }

  marcaUpsert: MarcaUpsertDto = {
    nombre: ''
  }

  marcaNombre: string = '';

  cerrar() {
    this.cerrarModal.emit();  // Emite evento al padre
  }

  guardarCambios() {
    if (this.objetoActualizar) {
      this.marcaUpsert.nombre = this.marcaNombre;

      this.marcaService.putMarca(this.objetoActualizar.id, this.marcaUpsert).subscribe({
        next:(response) => {
          this.objetoActualizar = response;
          this.toastrService.success('Marca actualizada correctamente!');
          this.objetoActualizado.emit(response);
          this.cerrarModal.emit();
        }
      })
    }
  }
}
