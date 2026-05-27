import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UsuarioPermisosResponseDto } from '../models/dtos/responses/usuario-permisos-response-dto';
import { CrearUsuarioUpsertDto } from '../models/dtos/requests/crear-usuario-upsert-dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/Usuarios';

  public getUsuariosActivos(): Observable<UsuarioPermisosResponseDto[]> {
    return this.http.get<UsuarioPermisosResponseDto[]>(this.urlBase + '/activos');
  }

  public getUsuariosInactivos(): Observable<UsuarioPermisosResponseDto[]> {
    return this.http.get<UsuarioPermisosResponseDto[]>(this.urlBase + '/inactivos');
  }

  public postUsuario(upsertUsuairo: CrearUsuarioUpsertDto): Observable<void> {
    return this.http.post<void>(this.urlBase, upsertUsuairo);
  }

}
