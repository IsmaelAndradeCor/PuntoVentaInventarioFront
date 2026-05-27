import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { HasPermissionDirective } from "../../../core/directives/has-permission.directive";
import { ListarProveedoresComponent } from "../listar-proveedores/listar-proveedores.component";
import { ListarProveedoresInactivosComponent } from "../listar-proveedores-inactivos/listar-proveedores-inactivos.component";
import { CrearProveedorComponent } from "../crear-proveedor/crear-proveedor.component";
import { PagosProveedoresComponent } from '../pagos-proveedores/pagos-proveedores.component';
import { PagarProveedorComponent } from '../pagar-proveedor/pagar-proveedor.component';
type AccionesTab = 'activos' | 'inactivos' | 'crear' | 'pagar' | 'pagos';

@Component({
  selector: 'app-pagina-proveedores',
  imports: [HasPermissionDirective, ListarProveedoresComponent, ListarProveedoresInactivosComponent, CrearProveedorComponent, PagarProveedorComponent, PagosProveedoresComponent],
  templateUrl: './pagina-proveedores.component.html',
  styleUrl: './pagina-proveedores.component.scss'
})
export class PaginaProveedoresComponent {
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
        return this.authService.hasPermission('proveedores.activos.ver');

      case 'inactivos':
        return this.authService.hasPermission('proveedores.inactivos.ver');

      case 'crear':
        return this.authService.hasPermission('proveedores.crear');

      case 'pagar':
        return this.authService.hasPermission('proveedores.pagar');

      case 'pagos':
        return this.authService.hasPermission('proveedores.pagos.ver');

      default:
        return false;
    }
  }

  private obtenerPrimerTabDisponible(): AccionesTab {
    if (this.puedeVerTab('activos')) return 'activos';
    if (this.puedeVerTab('inactivos')) return 'inactivos';
    if (this.puedeVerTab('crear')) return 'crear';
    if (this.puedeVerTab('pagar')) return 'pagar';
    if (this.puedeVerTab('pagos')) return 'pagos';

    return 'activos';
  }
}
