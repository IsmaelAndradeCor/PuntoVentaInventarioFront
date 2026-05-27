import { Component } from '@angular/core';
import { CrearUsuarioUpsertDto } from '../../../models/dtos/requests/crear-usuario-upsert-dto';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../services/usuario.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-usuario',
  imports: [FormsModule],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.scss'
})
export class CrearUsuarioComponent {

  constructor(private toastrService: ToastrService, private usuarioService: UsuarioService){}

  upsertUsuario: CrearUsuarioUpsertDto = {
    userName: '',
    password: '',
    nombreCompleto: '',
    rol: 'Empleado'
  }

  postUsuario() {
    this.usuarioService.postUsuario(this.upsertUsuario).subscribe({
      next:() => {
        this.upsertUsuario = {
          userName: '',
          password: '',
          nombreCompleto: '',
          rol: 'Empleado'
        }
        this.toastrService.success('Usuario creado correctamente');
      }
    })
  }
}
