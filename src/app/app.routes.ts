import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListarProductosComponent } from './components/producto/listar-productos/listar-productos.component';
import { ActualizarProductoComponent } from './components/producto/actualizar-producto/actualizar-producto.component';
import { CrearProductoComponent } from './components/producto/crear-producto/crear-producto.component';
import { EliminarProductoComponent } from './components/producto/eliminar-producto/eliminar-producto.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'producto/actualizar-producto', component: ActualizarProductoComponent},
    {path: 'producto/crear-producto', component: CrearProductoComponent},
    {path: 'producto/eliminar-producto', component: EliminarProductoComponent},
    {path: 'producto/listar-productos', component: ListarProductosComponent},
];
