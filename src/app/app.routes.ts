import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RealizarVentaComponent } from './components/venta/realizar-venta/realizar-venta.component';
import { ListarMarcasComponent } from './components/marca/listar-marcas/listar-marcas.component';
import { VentaComponent } from './components/venta/venta/venta.component';
import { ListarCategoriaComponent } from './components/categoria/listar-categorias/listar-categorias.component';
import { ListarUnidadesMedidaComponent } from './components/unidadMedida/listar-unidades-medida/listar-unidades-medida.component';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { permissionGuard } from './core/auth/permission.guard';
import { SinAccesoComponent } from './components/sin-acceso/sin-acceso.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ListarProveedoresComponent } from './components/proveedor/listar-proveedores/listar-proveedores.component';
import { PaginaProductosComponent } from './components/producto/pagina-productos/pagina-productos.component';
import { PaginaConfiguracionComponent } from './components/configuracion/pagina-configuracion/pagina-configuracion.component';

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
    path: 'venta/realizar-venta',
    component: RealizarVentaComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['ventas.realizar'] }
  },
  {
    path: 'venta/venta',
    component: VentaComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['ventas.historial.ver'] }
  },
  {
    path: 'marca/listar-marcas',
    component: ListarMarcasComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['marcas.ver'] }
  },
  {
    path: 'categoria/listar-categorias',
    component: ListarCategoriaComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['categorias.ver'] }
  },
  {
    path: 'unidadMedida/listar-unidades-medida',
    component: ListarUnidadesMedidaComponent,
    canActivate: [authGuard, permissionGuard],
    data: { permissions: ['unidadesmedida.ver'] }
  },
  {
    path: 'proveedor/listar-proveedores',
    component: ListarProveedoresComponent,
    canActivate: [authGuard, permissionGuard],
    data: { Permissions: ['proveedores.ver']}
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