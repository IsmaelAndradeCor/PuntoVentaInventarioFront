import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RolService } from '../../../services/rol.service';
import { RolUpsertDto } from '../../../models/dtos/requests/rol-upsert-dto';

@Component({
  selector: 'app-crear-rol',
  imports: [FormsModule],
  templateUrl: './crear-rol.component.html',
  styleUrl: './crear-rol.component.scss'
})
export class CrearRolComponent {

  constructor(
    private toastrService: ToastrService,
    private rolService: RolService
  ){}

  upsertRol: RolUpsertDto = {
    nombre: '',
    esAdmin: false
  }

  postRol() {
    this.rolService.postRol(this.upsertRol).subscribe({
      next: () => {
        this.upsertRol = { nombre: '', esAdmin: false };
        this.toastrService.success('Rol creado correctamente.');
      },
      error: (err) => {
        this.toastrService.error(err.error?.mensaje || 'Error al crear el rol.');
      }
    });
  }
}
