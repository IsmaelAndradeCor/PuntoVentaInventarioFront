import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { ActualizarUsuarioComponent } from '../actualizar-usuario/actualizar-usuario.component';
import { UsuarioPermisosResponseDto } from '../../../models/dtos/responses/usuario-permisos-response-dto';

@Component({
  selector: 'app-listar-usuarios-activos',
  imports: [CommonModule, FormsModule, ConfirmarModalComponent, ActualizarUsuarioComponent],
  templateUrl: './listar-usuarios-activos.component.html',
  styleUrl: './listar-usuarios-activos.component.scss'
})
export class ListarUsuariosActivosComponent implements OnInit {

  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private toastrService = inject(ToastrService);

  esAdmin = computed(() => this.authService.esAdmin());

  puedeActualizar = computed(() => this.esAdmin() && this.authService.hasPermission('usuarios.actualizar'));
  puedeDesactivar = computed(() => this.esAdmin() && this.authService.hasPermission('usuarios.desactivar'));

  usuariosDto: UsuarioPermisosResponseDto[] = [];
  usuariosFiltrados: UsuarioPermisosResponseDto[] = [];

  textoBusqueda: string = '';

  // Modal actualizar
  usuarioActualizar: UsuarioPermisosResponseDto | null = null;
  mostrarActualizarUsuario: boolean = false;

  // Modal confirmar desactivar
  mostrarConfirmarDesactivar: boolean = false;
  idUsuarioDesactivar: string | null = null;

  usuariosPorId: Map<string, UsuarioPermisosResponseDto> = new Map();

  ngOnInit() {
    this.getUsuariosActivos();
  }

  getUsuariosActivos(): void {
    this.usuarioService.getUsuariosActivos().subscribe({
      next: (usuarios) => {
        this.usuariosDto = usuarios;
        this.usuariosFiltrados = [...this.usuariosDto];
        this.usuariosPorId = new Map(
          this.usuariosDto.map(u => [u.id, u])
        );
      }
    });
  }

  trackByUsuarioId(index: number, item: UsuarioPermisosResponseDto): string {
    return item.id;
  }

  // ─── Filtro local ────────────────────────────────────────────────────────
  filtrarTabla(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();
    if (!texto) {
      this.usuariosFiltrados = [...this.usuariosDto];
      return;
    }
    this.usuariosFiltrados = this.usuariosDto.filter(u =>
      u.userName.toLowerCase().includes(texto) ||
      u.nombreCompleto.toLowerCase().includes(texto)
    );
  }

  limpiarTextoBusqueda(): void {
    this.textoBusqueda = '';
    this.filtrarTabla();
  }

  // ─── Actualizar ──────────────────────────────────────────────────────────
  abrirModalActualizar(usuario: UsuarioPermisosResponseDto): void {
    this.usuarioActualizar = usuario;
    this.mostrarActualizarUsuario = true;
  }

  cerrarModalActualizar(): void {
    this.mostrarActualizarUsuario = false;
    this.usuarioActualizar = null;
  }

  actualizarEnLista(objetoActualizado: UsuarioPermisosResponseDto): void {
    const index = this.usuariosDto.findIndex(u => u.id === objetoActualizado.id);
    if (index !== -1) {
      this.usuariosDto[index] = objetoActualizado;
      this.usuariosPorId.set(objetoActualizado.id, objetoActualizado);
    }
    this.filtrarTabla();
  }

  // ─── Desactivar ──────────────────────────────────────────────────────────
  mostrarModalConfirmarDesactivar(id: string): void {
    this.idUsuarioDesactivar = id;
    this.mostrarConfirmarDesactivar = true;
  }

  cerrarModalConfirmar(): void {
    this.mostrarConfirmarDesactivar = false;
    this.idUsuarioDesactivar = null;
  }

  desactivarUsuario(id: string): void {
    this.usuarioService.deactivateUsuario(id).subscribe({
      next: () => {
        this.usuariosPorId.delete(id);
        this.usuariosDto = this.usuariosDto.filter(u => u.id !== id);
        this.filtrarTabla();
        this.toastrService.success('Usuario desactivado con éxito.');
      }
    });
  }
}
