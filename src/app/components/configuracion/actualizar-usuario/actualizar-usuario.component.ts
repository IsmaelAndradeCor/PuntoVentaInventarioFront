import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { RolService } from '../../../services/rol.service';
import { ToastrService } from 'ngx-toastr';
import { UsuarioPermisosResponseDto } from '../../../models/dtos/responses/usuario-permisos-response-dto';
import { CambiarNombreCompletoUpsertDto } from '../../../models/dtos/requests/cambiar-nombre-completo-upsert-dto';
import { CambiarPasswordUpsertDto } from '../../../models/dtos/requests/cambiar-password-upsert-dto';
import { RolResponseDto } from '../../../models/dtos/responses/rol-response-dto';

@Component({
  selector: 'app-actualizar-usuario',
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-usuario.component.html',
  styleUrl: './actualizar-usuario.component.scss'
})
export class ActualizarUsuarioComponent implements OnInit {

  @ViewChild('inputNombre') inputNombre!: ElementRef<HTMLInputElement>;

  constructor(
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private toastrService: ToastrService
  ){}

  @Input() usuarioActualizar: UsuarioPermisosResponseDto | null = null;
  @Input() mostrarActualizarUsuario = false;

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() objetoActualizado = new EventEmitter<UsuarioPermisosResponseDto>();

  roles: RolResponseDto[] = [];
  rolSeleccionado: string = '';

  cambiarNombreDto: CambiarNombreCompletoUpsertDto = {
    nombreCompleto: ''
  }

  cambiarPasswordDto: CambiarPasswordUpsertDto = {
    nuevaPassword: ''
  }

  ngOnInit(): void {
    this.rolService.getRolesActivos().subscribe({
      next: (roles) => {
        this.roles = roles;
      }
    });
  }

  ngAfterViewInit(): void {
    this.enfocarInputNombre();
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: Event): void {
    event.preventDefault();
    this.guardarCambios();
  }

  private enfocarInputNombre(): void {
    setTimeout(() => {
      this.inputNombre?.nativeElement.focus();
      this.inputNombre?.nativeElement.select();
    }, 0);
  }

  cerrar() {
    this.cerrarModal.emit();
  }

  guardarCambios() {
    if (!this.usuarioActualizar) return;

    let cambiosRealizados = 0;
    let cambiosEsperados = 0;

    if (this.cambiarNombreDto.nombreCompleto.trim()) {
      cambiosEsperados++;
    }
    if (this.cambiarPasswordDto.nuevaPassword.trim()) {
      cambiosEsperados++;
    }
    if (this.rolSeleccionado && !this.usuarioActualizar.roles.includes(this.rolSeleccionado)) {
      cambiosEsperados++;
    }

    if (cambiosEsperados === 0) {
      this.toastrService.warning('No hay cambios que guardar.');
      return;
    }

    if (this.cambiarNombreDto.nombreCompleto.trim()) {
      this.usuarioService.putNombreCompleto(this.usuarioActualizar.id, this.cambiarNombreDto).subscribe({
        next: () => {
          this.toastrService.success('Nombre actualizado correctamente.');
          this.usuarioActualizar!.nombreCompleto = this.cambiarNombreDto.nombreCompleto.trim();
          cambiosRealizados++;
          if (cambiosRealizados === cambiosEsperados) {
            this.objetoActualizado.emit(this.usuarioActualizar!);
            this.cerrarModal.emit();
          }
        },
        error: () => {
          this.toastrService.error('Error al actualizar el nombre.');
        }
      });
    }

    if (this.rolSeleccionado && !this.usuarioActualizar.roles.includes(this.rolSeleccionado)) {
      this.usuarioService.putRol(this.usuarioActualizar.id, { rol: this.rolSeleccionado }).subscribe({
        next: (response: any) => {
          this.toastrService.success('Rol actualizado correctamente.');
          cambiosRealizados++;
          if (cambiosRealizados === cambiosEsperados) {
            this.objetoActualizado.emit(this.usuarioActualizar!);
            this.cerrarModal.emit();
          }
        },
        error: (err) => {
          this.toastrService.error(err.error?.mensaje || 'Error al cambiar el rol.');
        }
      });
    }

    if (this.cambiarPasswordDto.nuevaPassword.trim()) {
      this.usuarioService.putPassword(this.usuarioActualizar.id, this.cambiarPasswordDto).subscribe({
        next: () => {
          this.toastrService.success('Contraseña actualizada correctamente.');
          this.cambiarPasswordDto.nuevaPassword = '';
          cambiosRealizados++;
          if (cambiosRealizados === cambiosEsperados) {
            this.objetoActualizado.emit(this.usuarioActualizar!);
            this.cerrarModal.emit();
          }
        },
        error: () => {
          this.toastrService.error('Error al cambiar la contraseña.');
        }
      });
    }
  }
}
