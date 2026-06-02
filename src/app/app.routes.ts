import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RealizarVentaComponent } from './components/venta/realizar-venta/realizar-venta.component';
import { VentaComponent } from './components/venta/venta/venta.component';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { permissionGuard } from './core/auth/permission.guard';
import { SinAccesoComponent } from './components/sin-acceso/sin-acceso.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PaginaProductosComponent } from './components/producto/pagina-productos/pagina-productos.component';
import { PaginaConfiguracionComponent } from './components/configuracion/pagina-configuracion/pagina-configuracion.component';
import { PaginaMarcasComponent } from './components/marca/pagina-marcas/pagina-marcas.component';
import { PaginaProveedoresComponent } from './components/Proveedor/pagina-proveedores/pagina-proveedores.component';
import { PaginaCategoriasComponent } from './components/categoria/pagina-categorias/pagina-categorias.component';
import { PaginaUnidadesMedidaComponent } from './components/unidadMedida/pagina-unidades-medida/pagina-unidades-medida.component';
import { PaginaCorteCajaComponent } from './components/corte-caja/pagina-corte-caja/pagina-corte-caja.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sin-acceso', component: SinAccesoComponent, canActivate: [authGuard] },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['home.ver'] }
  },
  {
    path: 'producto/pagina-productos',
    component: PaginaProductosComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['productos.ver'] }
  },
  { 
    path: 'venta/pagina-ventas',
    component: RealizarVentaComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['ventas.ver'] }
  },
  {
    path: 'corte-caja/pagina-corte-caja',
    component: PaginaCorteCajaComponent,
    canActivate: [authGuard, permissionGuard],
    data: {permissions: ['cortecaja.ver']}
  },
  {
    path: 'venta/venta',
    component: VentaComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['ventas.historial.ver'] }
  },
  {
    path: 'marca/pagina-marcas',
    component: PaginaMarcasComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['marcas.ver'] }
  },
  {
    path: 'categoria/pagina-categorias',
    component: PaginaCategoriasComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['categorias.ver'] }
  },
  {
    path: 'unidadMedida/pagina-unidades-medida',
    component: PaginaUnidadesMedidaComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['unidadesmedida.ver'] }
  },
  {
    path: 'proveedor/pagina-proveedores',
    component: PaginaProveedoresComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['proveedores.ver']}
  },
  {
    path: 'configuracion/pagina-configuracion',
    component: PaginaConfiguracionComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Administrador']}
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' }
];