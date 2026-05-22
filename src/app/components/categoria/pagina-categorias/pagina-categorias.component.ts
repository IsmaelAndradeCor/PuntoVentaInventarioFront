import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { HasPermissionDirective } from "../../../core/directives/has-permission.directive";
import { ListarCategoriaComponent } from "../listar-categorias/listar-categorias.component";
import { ListarCategoriasInactivasComponent } from "../listar-categorias-inactivas/listar-categorias-inactivas.component";
import { CrearCategoriaComponent } from "../crear-categoria/crear-categoria.component";
type AccionesTab = 'activos' | 'inactivos' | 'crear';

@Component({
  selector: 'app-pagina-categorias',
  imports: [HasPermissionDirective, ListarCategoriaComponent, ListarCategoriasInactivasComponent, CrearCategoriaComponent],
  templateUrl: './pagina-categorias.component.html',
  styleUrl: './pagina-categorias.component.scss'
})
export class PaginaCategoriasComponent {
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
        return this.authService.hasPermission('categorias.activos.ver');

      case 'inactivos':
        return this.authService.hasPermission('categorias.inactivos.ver');

      case 'crear':
        return this.authService.hasPermission('categorias.crear');

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
