import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PermisoNodoDto } from '../models/dtos/responses/permiso-nodo-dto';
import { PermisoOperacionResponseDto } from '../models/permiso-operacion-response-dto';

@Injectable({
  providedIn: 'root'
})

export class PermisosService {
  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/UsuarioPermisos';

  // getCatalogoPermisos(): Observable<string[]>  {
  //   return this.http.get<string[]>(this.urlBase + '/permisos/catalogo')
  // }

  getCatalogoUi() {
    return this.http.get<PermisoNodoDto[]>(`${this.urlBase}/catalogo-ui`);
  }

  asignarPermiso(userId: string, permission: string): Observable<PermisoOperacionResponseDto> {
    return this.http.post<PermisoOperacionResponseDto>(`${this.urlBase}/${userId}/permisos/${encodeURIComponent(permission)}`, {});
  }

  quitarPermiso(userId: string, permission: string): Observable<PermisoOperacionResponseDto> {
    return this.http.delete<PermisoOperacionResponseDto>(`${this.urlBase}/${userId}/permisos/${encodeURIComponent(permission)}`);
  }

}