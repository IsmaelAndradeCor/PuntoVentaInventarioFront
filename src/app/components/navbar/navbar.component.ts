import { Component, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

interface NavItem {
  label: string;
  route: string;
  permissions: string[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, HasPermissionDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {


  navItems: NavItem[] = [
    { label: 'Inicio', route: '/home', permissions: ['home.ver'] },
    { label: 'Venta', route: '/venta/pagina-ventas', permissions: ['ventas.ver'] },
    { label: 'Productos', route: '/producto/pagina-productos', permissions: ['productos.ver'] },
    { label: 'Marcas', route: '/marca/pagina-marcas', permissions: ['marcas.ver'] },
    { label: 'Categorias', route: '/categoria/pagina-categorias', permissions: ['categorias.ver'] },
    { label: 'Unidades Medida', route: '/unidadMedida/pagina-unidades-medida', permissions: ['unidadesmedida.ver'] },
    { label: 'Proveedores', route: '/proveedor/pagina-proveedores', permissions: ['proveedores.ver'] },
    // { label: 'Historial Ventas', route: '/venta/venta', permissions: ['ventas.historial.ver'] }
  ];

  visibleNavItems = computed(() => {
    return this.navItems.filter(item =>
      item.permissions.some(permission => this.authService.hasPermission(permission))
    );
  });

  constructor(
    public themeService: ThemeService,
    public authService: AuthService,
    private router: Router
  ) {
    // console.log('Roles:', this.authService.roles());
    // console.log('Permissions:', this.authService.permissions());
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  // esAdmin(): boolean {
  //   // console.log(this.authService)
  //   return this.authService.hasRole('Administrador');
  // }
}
