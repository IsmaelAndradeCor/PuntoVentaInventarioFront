import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { ListarUnidadesMedidaComponent } from "../listar-unidades-medida/listar-unidades-medida.component";
import { ListarUnidadesMedidaInactivasComponent } from '../listar-unidades-medida-inactivas/listar-unidades-medida-inactivas.component';
import { CrearUnidadMedidaComponent } from "../crear-unidad-medida/crear-unidad-medida.component";
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';
type AccionesTab = 'activos' | 'inactivos' | 'crear';

@Component({
  selector: 'app-pagina-unidades-medida',
  imports: [ListarUnidadesMedidaComponent, ListarUnidadesMedidaInactivasComponent, CrearUnidadMedidaComponent, HasPermissionDirective],
  templateUrl: './pagina-unidades-medida.component.html',
  styleUrl: './pagina-unidades-medida.component.scss'
})
export class PaginaUnidadesMedidaComponent {
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
        return this.authService.hasPermission('unidadesmedida.activos.ver');

      case 'inactivos':
        return this.authService.hasPermission('unidadesmedida.inactivos.ver');

      case 'crear':
        return this.authService.hasPermission('unidadesmedida.crear');

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
