import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';
import { ListarRolesActivosComponent } from '../listar-roles-activos/listar-roles-activos.component';
import { ListarRolesInactivosComponent } from '../listar-roles-inactivos/listar-roles-inactivos.component';
import { CrearRolComponent } from '../crear-rol/crear-rol.component';

type AccionesTab = 'activos' | 'inactivos' | 'crear';

@Component({
  selector: 'app-pagina-roles',
  imports: [HasPermissionDirective, ListarRolesActivosComponent, ListarRolesInactivosComponent, CrearRolComponent],
  templateUrl: './pagina-roles.component.html',
  styleUrl: './pagina-roles.component.scss'
})
export class PaginaRolesComponent {
  private authService = inject(AuthService);

  activeTab: AccionesTab = 'activos';

  ngOnInit(): void {
    this.activeTab = this.obtenerPrimerTabDisponible();
  }

  seleccionarTab(tab: AccionesTab): void {
    if (!this.puedeVerTab(tab)) return;
    this.activeTab = tab;
  }

  puedeVerTab(tab: AccionesTab): boolean {
    switch (tab) {
      case 'activos':
        return this.authService.hasPermission('roles.activos.ver');
      case 'inactivos':
        return this.authService.hasPermission('roles.inactivos.ver');
      case 'crear':
        return this.authService.hasPermission('roles.crear');
      default:
        return false;
    }
  }

  private obtenerPrimerTabDisponible(): AccionesTab {
    if (this.puedeVerTab('activos')) return 'activos';
    if (this.puedeVerTab('inactivos')) return 'inactivos';
    if (this.puedeVerTab('crear')) return 'crear';
    return 'activos';
  }
}
