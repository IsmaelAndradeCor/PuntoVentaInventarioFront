import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UnidadMedidaService } from '../../../services/unidad-medida.service';
import { ToastrService } from 'ngx-toastr';
import { UnidadMedidaResponseDto } from '../../../models/dtos/responses/unidad-medida-response-dto';
import { UnidadMedidaUpsertDto } from '../../../models/dtos/requests/unidad-medida-upsert-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actualizar-unidad-medida',
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-unidad-medida.component.html',
  styleUrl: './actualizar-unidad-medida.component.scss'
})
export class ActualizarUnidadMedidaComponent implements OnInit {

  constructor(private unidadMedidaService: UnidadMedidaService,
              private toastrService: ToastrService
  ){}

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() objetoActualizado = new EventEmitter<UnidadMedidaResponseDto>();

  @Input() objetoActualizar: UnidadMedidaResponseDto | null = null;
  @Input() mostrarActualizar = false;

  ngOnInit(): void {
    this.unidadMedidaNombre = this.objetoActualizar?.nombre ?? '';
    this.unidadMedidaClave = this.objetoActualizar?.clave ?? '';
    this.unidadMedidaPermiteDecimales = this.objetoActualizar?.permiteDecimales ?? false;
  }

  unidadMedidaUpsertDto: UnidadMedidaUpsertDto = {
    nombre : '',
    clave : '',
    permiteDecimales : false
  }

  unidadMedidaNombre: string = '';
  unidadMedidaClave: string = '';
  unidadMedidaPermiteDecimales: boolean = false;

  cerrar() {
    this.cerrarModal.emit();  // Emite evento al padre
  }

  guardarCambios() {
    if (this.objetoActualizar) {
      this.unidadMedidaUpsertDto.nombre = this.unidadMedidaNombre;
      this.unidadMedidaUpsertDto.clave = this.unidadMedidaClave;
      this.unidadMedidaUpsertDto.permiteDecimales = this.unidadMedidaPermiteDecimales;

      this.unidadMedidaService.putUnidadMedida(this.objetoActualizar.id, this.unidadMedidaUpsertDto).subscribe({
        next:(response) => {
          this.objetoActualizar = response;
          this.toastrService.success('Unidad de Medida actualizada correctamente!');
          this.objetoActualizado.emit(response);
          this.cerrarModal.emit();
        }
      })
    }
  }
}
