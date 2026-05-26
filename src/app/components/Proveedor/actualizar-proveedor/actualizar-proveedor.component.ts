import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProveedorService } from '../../../services/proveedor.service';
import { ToastrService } from 'ngx-toastr';
import { ProveedorResponseDto } from '../../../models/dtos/responses/proveedor-response-dto';
import { ProveedorUpsertDto } from '../../../models/dtos/requests/proveedor-upsert-dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actualizar-proveedor',
  imports: [FormsModule, CommonModule],
  templateUrl: './actualizar-proveedor.component.html',
  styleUrl: './actualizar-proveedor.component.scss'
})
export class ActualizarProveedorComponent implements OnInit {

  constructor(private proveedorService: ProveedorService,
              private toastrService: ToastrService
  ){}

  @Output() cerrarModal = new EventEmitter<void>();  // ← Output correcto para cerrar
  @Output() objetoActualizado = new EventEmitter<ProveedorResponseDto>();

  @Input() objetoActualizar: ProveedorResponseDto | null = null;
  @Input() mostrarActualizar = false;

  proveedorUpsert: ProveedorUpsertDto = {
    nombre: '',
    telefono: '',
    contacto: '',
    correo: ''
  }

  proveedorNombre: string = '';
  proveedorTelefono: string = '';
  proveedorContacto: string = '';
  proveedorCorreo: string = '';

  ngOnInit(): void {
    this.proveedorNombre = this.objetoActualizar?.nombre!;
    this.proveedorTelefono = this.objetoActualizar?.telefono!;
    this.proveedorContacto = this.objetoActualizar?.contacto!;
    this.proveedorCorreo = this.objetoActualizar?.correo!;
  }

  cerrar() {
    this.cerrarModal.emit();  // Emite evento al padre
  }

  guardarCambios() {
    if (this.objetoActualizar) {
      this.proveedorUpsert.nombre = this.proveedorNombre;
      this.proveedorUpsert.telefono = this.proveedorTelefono;
      this.proveedorUpsert.contacto = this.proveedorContacto;
      this.proveedorUpsert.correo = this.proveedorCorreo;

      this.proveedorService.putProveedor(this.objetoActualizar.id, this.proveedorUpsert).subscribe({
        next:(response) => {
          this.objetoActualizar = response;
          this.toastrService.success('Proveedor actualizado correctamente!');
          this.objetoActualizado.emit(response);
          this.cerrarModal.emit();
        }
      });
    }
  }
}
