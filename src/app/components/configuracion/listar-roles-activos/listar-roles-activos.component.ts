import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/auth/auth.service';
import { RolService } from '../../../services/rol.service';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { ActualizarRolComponent } from '../actualizar-rol/actualizar-rol.component';
import { RolResponseDto } from '../../../models/dtos/responses/rol-response-dto';

@Component({
  selector: 'app-listar-roles-activos',
  imports: [CommonModule, FormsModule, ConfirmarModalComponent, ActualizarRolComponent],
  templateUrl: './listar-roles-activos.component.html',
  styleUrl: './listar-roles-activos.component.scss'
})
export class ListarRolesActivosComponent implements OnInit {

  private authService = inject(AuthService);
  private rolService = inject(RolService);
  private toastrService = inject(ToastrService);

  esAdmin = computed(() => this.authService.hasRole('Administrador'));

  puedeActualizar = computed(() => this.esAdmin() && this.authService.hasPermission('roles.actualizar'));
  puedeDesactivar = computed(() => this.esAdmin() && this.authService.hasPermission('roles.desactivar'));

  rolesDto: RolResponseDto[] = [];
  rolesFiltrados: RolResponseDto[] = [];

  textoBusqueda: string = '';

  // Modal actualizar
  rolActualizar: RolResponseDto | null = null;
  mostrarActualizarRol: boolean = false;

  // Modal confirmar desactivar
  mostrarConfirmarDesactivar: boolean = false;
  idRolDesactivar: string | null = null;

  rolesPorId: Map<string, RolResponseDto> = new Map();

  ngOnInit() {
    this.getRolesActivos();
  }

  getRolesActivos(): void {
    this.rolService.getRolesActivos().subscribe({
      next: (roles) => {
        this.rolesDto = roles;
        this.rolesFiltrados = [...this.rolesDto];
        this.rolesPorId = new Map(
          this.rolesDto.map(r => [r.id, r])
        );
      }
    });
  }

  trackByRolId(index: number, item: RolResponseDto): string {
    return item.id;
  }

  filtrarTabla(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();
    if (!texto) {
      this.rolesFiltrados = [...this.rolesDto];
      return;
    }
    this.rolesFiltrados = this.rolesDto.filter(r =>
      r.nombre.toLowerCase().includes(texto)
    );
  }

  limpiarTextoBusqueda(): void {
    this.textoBusqueda = '';
    this.filtrarTabla();
  }

  abrirModalActualizar(rol: RolResponseDto): void {
    this.rolActualizar = rol;
    this.mostrarActualizarRol = true;
  }

  cerrarModalActualizar(): void {
    this.mostrarActualizarRol = false;
    this.rolActualizar = null;
  }

  actualizarEnLista(objetoActualizado: RolResponseDto): void {
    const index = this.rolesDto.findIndex(r => r.id === objetoActualizado.id);
    if (index !== -1) {
      this.rolesDto[index] = objetoActualizado;
      this.rolesPorId.set(objetoActualizado.id, objetoActualizado);
    }
    this.filtrarTabla();
  }

  mostrarModalConfirmarDesactivar(id: string): void {
    this.idRolDesactivar = id;
    this.mostrarConfirmarDesactivar = true;
  }

  cerrarModalConfirmar(): void {
    this.mostrarConfirmarDesactivar = false;
    this.idRolDesactivar = null;
  }

  desactivarRol(id: string): void {
    this.rolService.deactivateRol(id).subscribe({
      next: () => {
        this.rolesPorId.delete(id);
        this.rolesDto = this.rolesDto.filter(r => r.id !== id);
        this.filtrarTabla();
        this.toastrService.success('Rol desactivado con éxito.');
      },
      error: (err) => {
        this.toastrService.error(err.error?.mensaje || 'Error al desactivar el rol.');
      }
    });
  }
}
