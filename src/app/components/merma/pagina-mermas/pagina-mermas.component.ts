import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';
import { RegistrarMermaComponent } from '../registrar-merma/registrar-merma.component';
import { HistorialMermaComponent } from '../historial-merma/historial-merma.component';

type AccionesTab = 'registrar' | 'historial';

@Component({
  selector: 'app-pagina-mermas',
  imports: [CommonModule, HasPermissionDirective, RegistrarMermaComponent, HistorialMermaComponent],
  templateUrl: './pagina-mermas.component.html',
  styleUrl: './pagina-mermas.component.scss'
})
export class PaginaMermasComponent {
  private authService = inject(AuthService);

  activeTab: AccionesTab = 'registrar';

  ngOnInit(): void {
    this.activeTab = this.obtenerPrimerTabDisponible();
  }

  seleccionarTab(tab: AccionesTab): void {
    if (!this.puedeVerTab(tab)) return;
    this.activeTab = tab;
  }

  puedeVerTab(tab: AccionesTab): boolean {
    switch (tab) {
      case 'registrar':
        return this.authService.hasPermission('mermas.registrar');
      case 'historial':
        return this.authService.hasPermission('mermas.historial.ver');
      default:
        return false;
    }
  }

  private obtenerPrimerTabDisponible(): AccionesTab {
    if (this.puedeVerTab('registrar')) return 'registrar';
    if (this.puedeVerTab('historial')) return 'historial';
    return 'registrar';
  }
}
