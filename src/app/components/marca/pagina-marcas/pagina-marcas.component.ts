import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';
import { ListarMarcasComponent } from '../listar-marcas/listar-marcas.component';
import { ListarMarcasInactivasComponent } from '../listar-marcas-inactivas/listar-marcas-inactivas.component';
import { CrearMarcaComponent } from '../crear-marca/crear-marca.component';

type AccionesTab = 'activos' | 'inactivos' | 'crear';

@Component({
  selector: 'app-pagina-marcas',
  imports: [CommonModule, FormsModule, HasPermissionDirective, ListarMarcasComponent, ListarMarcasInactivasComponent, CrearMarcaComponent],
  templateUrl: './pagina-marcas.component.html',
  styleUrl: './pagina-marcas.component.scss'
})
export class PaginaMarcasComponent {
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
        return this.authService.hasPermission('marcas.activos.ver');

      case 'inactivos':
        return this.authService.hasPermission('marcas.inactivos.ver');

      case 'crear':
        return this.authService.hasPermission('marcas.crear');

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
