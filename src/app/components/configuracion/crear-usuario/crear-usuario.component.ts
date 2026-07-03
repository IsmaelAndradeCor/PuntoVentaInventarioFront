import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearUsuarioUpsertDto } from '../../../models/dtos/requests/crear-usuario-upsert-dto';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../services/usuario.service';
import { RolService } from '../../../services/rol.service';
import { FormsModule } from '@angular/forms';
import { RolResponseDto } from '../../../models/dtos/responses/rol-response-dto';

@Component({
  selector: 'app-crear-usuario',
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.scss'
})
export class CrearUsuarioComponent implements OnInit {

  constructor(
    private toastrService: ToastrService,
    private usuarioService: UsuarioService,
    private rolService: RolService
  ){}

  roles: RolResponseDto[] = [];

  upsertUsuario: CrearUsuarioUpsertDto = {
    userName: '',
    password: '',
    nombreCompleto: '',
    rol: ''
  }

  ngOnInit(): void {
    this.rolService.getRolesActivos().subscribe({
      next: (roles) => {
        this.roles = roles;
      }
    });
  }

  postUsuario() {
    this.usuarioService.postUsuario(this.upsertUsuario).subscribe({
      next:() => {
        this.upsertUsuario = {
          userName: '',
          password: '',
          nombreCompleto: '',
          rol: ''
        }
        this.toastrService.success('Usuario creado correctamente');
      },
      error: (err) => {
        this.toastrService.error(err.error?.mensaje || 'Error al crear el usuario.');
      }
    })
  }
}
