import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProveedorService } from '../../../services/proveedor.service';
import { ProveedorUpsertDto } from '../../../models/dtos/requests/proveedor-upsert-dto';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-proveedor',
  imports: [FormsModule],
  templateUrl: './crear-proveedor.component.html',
  styleUrl: './crear-proveedor.component.scss'
})
export class CrearProveedorComponent {

  @ViewChild('inputNombre') inputNombre!: ElementRef<HTMLInputElement>;

  constructor(private proveedorService: ProveedorService,
      private toastrService: ToastrService){}

  proveedorUpsert: ProveedorUpsertDto = {
    nombre: '',
    telefono: '',
    contacto: '',
    correo: ''
  };

  crearProveedor(): void {
    this.proveedorService.postProveedor(this.proveedorUpsert).subscribe({
      next:(response) => {
        this.toastrService.success('Proveedor ' + response.nombre + ' creado correctamente.');
        
        //Limpiamos nuestro Upsert
        this.proveedorUpsert = {
          nombre: '',
          telefono: '',
          contacto: '',
          correo: ''
        }

        //Nos posicionamos en el input
        this.enfocarInput();
      }
    })
  }

  private enfocarInput(): void {
    setTimeout(() => {
      this.inputNombre.nativeElement.focus();
    });
  }

}
