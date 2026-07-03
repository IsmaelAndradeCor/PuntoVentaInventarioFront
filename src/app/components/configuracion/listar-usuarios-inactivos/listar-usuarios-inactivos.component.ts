import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { UsuarioPermisosResponseDto } from '../../../models/dtos/responses/usuario-permisos-response-dto';

@Component({
  selector: 'app-listar-usuarios-inactivos',
  imports: [CommonModule, FormsModule, ConfirmarModalComponent],
  templateUrl: './listar-usuarios-inactivos.component.html',
  styleUrl: './listar-usuarios-inactivos.component.scss'
})
export class ListarUsuariosInactivosComponent implements OnInit {

  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private toastrService = inject(ToastrService);

  esAdmin = computed(() => this.authService.esAdmin());
  puedeActivar = computed(() => this.esAdmin() && this.authService.hasPermission('usuarios.activar'));

  usuariosDto: UsuarioPermisosResponseDto[] = [];
  usuariosFiltrados: UsuarioPermisosResponseDto[] = [];

  textoBusqueda: string = '';

  mostrarConfirmarActivar: boolean = false;
  idUsuarioActivar: string | null = null;

  usuariosPorId: Map<string, UsuarioPermisosResponseDto> = new Map();

  ngOnInit() {
    this.getUsuariosInactivos();
  }

  getUsuariosInactivos(): void {
    this.usuarioService.getUsuariosInactivos().subscribe({
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

  // ─── Activar ─────────────────────────────────────────────────────────────
  mostrarModalConfirmarActivar(id: string): void {
    this.idUsuarioActivar = id;
    this.mostrarConfirmarActivar = true;
  }

  cerrarModalConfirmar(): void {
    this.mostrarConfirmarActivar = false;
    this.idUsuarioActivar = null;
  }

  activarUsuario(id: string): void {
    this.usuarioService.activateUsuario(id).subscribe({
      next: () => {
        this.usuariosPorId.delete(id);
        this.usuariosDto = this.usuariosDto.filter(u => u.id !== id);
        this.filtrarTabla();
        this.toastrService.success('Usuario activado con éxito.');
      }
    });
  }
}
