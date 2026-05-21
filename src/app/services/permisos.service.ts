import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PermisoNodoDto } from '../models/dtos/responses/permiso-nodo-dto';

@Injectable({
  providedIn: 'root'
})

export class PermisosService {
  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/UsuarioPermisos';

  getCatalogoPermisos(): Observable<string[]>  {
    return this.http.get<string[]>(this.urlBase + '/permisos/catalogo')
  }

  getCatalogoUi() {
    return this.http.get<PermisoNodoDto[]>(`${this.urlBase}/catalogo-ui`);
  }

}