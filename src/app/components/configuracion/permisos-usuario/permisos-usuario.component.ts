import { Component, inject } from '@angular/core';
import { PermisosService } from '../../../services/permisos.service';
import { PermisoNodoDto } from '../../../models/dtos/responses/permiso-nodo-dto';
import { AuthService } from '../../../core/auth/auth.service';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioPermisosResponseDto } from '../../../models/dtos/responses/usuario-permisos-response-dto';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-permisos-usuario',
  imports: [FormsModule],
  templateUrl: './permisos-usuario.component.html',
  styleUrl: './permisos-usuario.component.scss'
})
export class PermisosUsuarioComponent {

  constructor(private usuarioService: UsuarioService, private authService: AuthService, private toastrService: ToastrService){}

  private permisosService = inject(PermisosService);

  catalogo: PermisoNodoDto[] = [];
  seleccionados = new Set<string>();
  actualizando = new Set<string>();

  usuarios: UsuarioPermisosResponseDto[] = [];
  usuarioSeleccionado = '';
  usuarioId = '';

  ngOnInit(): void {
    this.getCatalogoUi();
    this.getUsuariosActivos();
  }

  getCatalogoUi(){
    this.permisosService.getCatalogoUi().subscribe(data => {
      this.catalogo = data;
    });
  }

  getUsuariosActivos(): void {
    this.usuarioService.getUsuariosActivos().subscribe({
      next: (response) => {
        this.usuarios = response;

        if (this.usuarios.length === 0) return;

        const usuarioActual = this.usuarios.find(
          x => x.userName === this.authService.userName()
        );

        if (!usuarioActual) return;

        this.usuarioSeleccionado = usuarioActual.userName;
        this.usuarioId = usuarioActual.id;
        this.seleccionados = new Set(usuarioActual.permissions ?? []);
      }
    });
  }


  onUsuarioChange(userName: string): void {
    this.usuarioSeleccionado = userName;

    const usuario = this.usuarios.find(
      u => u.userName.toLowerCase() === userName.trim().toLowerCase()
    );

    this.usuarioId = usuario?.id ?? '';
    this.seleccionados = new Set(usuario?.permissions ?? []);
  }

  limpiarSeleccionUsuario(): void {
    this.usuarioSeleccionado = '';
    this.seleccionados = new Set();
  }

  estaActualizando(permiso?: string): boolean {
    return permiso ? this.actualizando.has(permiso) : false;
  }

  onTogglePermiso(permiso: string | undefined, checked: boolean): void {
    if (!permiso || !this.usuarioId || this.actualizando.has(permiso)) return;

    this.actualizando.add(permiso);

    const request$ = checked
      ? this.permisosService.asignarPermiso(this.usuarioId, permiso)
      : this.permisosService.quitarPermiso(this.usuarioId, permiso);

    request$
      .pipe(
        finalize(() => this.actualizando.delete(permiso))
      )
      .subscribe({
        next: (response) => {
          if (checked) {
            this.seleccionados.add(permiso);
          } else {
            this.seleccionados.delete(permiso);
          }
          
          this.toastrService.success(response.mensaje)
        },
        error: () => {
          // console.error(error);
        }
      });
  }

  tiene(permiso?: string): boolean {
    return permiso ? this.seleccionados.has(permiso) : false;
  }

  obtenerPermisosSeleccionados(): string[] {
    return Array.from(this.seleccionados);
  }

}
