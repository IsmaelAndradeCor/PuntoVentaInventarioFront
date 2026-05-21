import { Component, inject } from '@angular/core';
import { PermisosService } from '../../../services/permisos.service';
import { PermisoNodoDto } from '../../../models/dtos/responses/permiso-nodo-dto';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-test-permisos',
  imports: [],
  templateUrl: './test-permisos.component.html',
  styleUrl: './test-permisos.component.scss'
})
export class TestPermisosComponent {

  constructor(public authService: AuthService){}

  private permisosService = inject(PermisosService);

  catalogo: PermisoNodoDto[] = [];
  seleccionados = new Set<string>();

  ngOnInit(): void {
    this.permisosService.getCatalogoUi().subscribe(data => {
      this.catalogo = data;
    });

    this.permisosService.getCatalogoPermisos().subscribe(data => {
      this.seleccionados = new Set(data);
    });
  }

  toggle(permiso: string | undefined, checked: boolean): void {
    if (!permiso) return;

    if (checked) this.seleccionados.add(permiso);
    else this.seleccionados.delete(permiso);
  }

  tiene(permiso?: string): boolean {
    return permiso ? this.seleccionados.has(permiso) : false;
  }

  obtenerPermisosSeleccionados(): string[] {
    return Array.from(this.seleccionados);
  }

}
