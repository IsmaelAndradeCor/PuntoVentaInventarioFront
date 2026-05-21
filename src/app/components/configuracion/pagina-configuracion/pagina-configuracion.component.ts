import { Component, inject } from '@angular/core';
import { TestPermisosComponent } from '../test-permisos/test-permisos.component';
import { AuthService } from '../../../core/auth/auth.service';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';
import { CrearUsuarioComponent } from '../crear-usuario/crear-usuario.component';
import { ListarUsuariosActivosComponent } from '../listar-usuarios-activos/listar-usuarios-activos.component';
import { ListarUsuariosInactivosComponent } from '../listar-usuarios-inactivos/listar-usuarios-inactivos.component';
import { PermisosUsuarioComponent } from '../permisos-usuario/permisos-usuario.component';

type AccionesTab = 'activos' | 'inactivos' | 'crear usuario'| 'permisos usuario'| 'test';

@Component({
  selector: 'app-pagina-configuracion',
  imports: [HasPermissionDirective, CrearUsuarioComponent, ListarUsuariosActivosComponent, ListarUsuariosInactivosComponent, PermisosUsuarioComponent, TestPermisosComponent],
  templateUrl: './pagina-configuracion.component.html',
  styleUrl: './pagina-configuracion.component.scss'
})
export class PaginaConfiguracionComponent {
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
      case 'test':
        return true;

      case 'activos':
        return this.authService.hasPermission('usuarios.activos.ver');

      case 'inactivos':
        return this.authService.hasPermission('usuarios.inactivos.ver');

      case 'crear usuario':
        return this.authService.hasPermission('usuarios.crear');

      case 'permisos usuario':
        return this.authService.hasPermission('usuarios.permisos.ver');

      default:
        return false;
    }
  }

  private obtenerPrimerTabDisponible(): AccionesTab {
    if (this.puedeVerTab('test')) return 'test';
    if (this.puedeVerTab('activos')) return 'activos';
    if (this.puedeVerTab('inactivos')) return 'inactivos';
    if (this.puedeVerTab('crear usuario')) return 'crear usuario';
    if (this.puedeVerTab('permisos usuario')) return 'permisos usuario';

    return 'activos';
  }
}
