import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/auth/auth.service';
import { RolService } from '../../../services/rol.service';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { RolResponseDto } from '../../../models/dtos/responses/rol-response-dto';

@Component({
  selector: 'app-listar-roles-inactivos',
  imports: [CommonModule, FormsModule, ConfirmarModalComponent],
  templateUrl: './listar-roles-inactivos.component.html',
  styleUrl: './listar-roles-inactivos.component.scss'
})
export class ListarRolesInactivosComponent implements OnInit {

  private authService = inject(AuthService);
  private rolService = inject(RolService);
  private toastrService = inject(ToastrService);

  esAdmin = computed(() => this.authService.hasRole('Administrador'));
  puedeActivar = computed(() => this.esAdmin() && this.authService.hasPermission('roles.activar'));

  rolesDto: RolResponseDto[] = [];
  rolesFiltrados: RolResponseDto[] = [];

  textoBusqueda: string = '';

  mostrarConfirmarActivar: boolean = false;
  idRolActivar: string | null = null;

  rolesPorId: Map<string, RolResponseDto> = new Map();

  ngOnInit() {
    this.getRolesInactivos();
  }

  getRolesInactivos(): void {
    this.rolService.getRolesInactivos().subscribe({
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

  mostrarModalConfirmarActivar(id: string): void {
    this.idRolActivar = id;
    this.mostrarConfirmarActivar = true;
  }

  cerrarModalConfirmar(): void {
    this.mostrarConfirmarActivar = false;
    this.idRolActivar = null;
  }

  activarRol(id: string): void {
    this.rolService.activateRol(id).subscribe({
      next: () => {
        this.rolesPorId.delete(id);
        this.rolesDto = this.rolesDto.filter(r => r.id !== id);
        this.filtrarTabla();
        this.toastrService.success('Rol activado con éxito.');
      }
    });
  }
}
