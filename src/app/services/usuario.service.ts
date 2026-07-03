import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UsuarioPermisosResponseDto } from '../models/dtos/responses/usuario-permisos-response-dto';
import { CrearUsuarioUpsertDto } from '../models/dtos/requests/crear-usuario-upsert-dto';
import { CambiarNombreCompletoUpsertDto } from '../models/dtos/requests/cambiar-nombre-completo-upsert-dto';
import { CambiarPasswordUpsertDto } from '../models/dtos/requests/cambiar-password-upsert-dto';
import { CambiarRolUpsertDto } from '../models/dtos/requests/cambiar-rol-upsert-dto';

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

  public getUsuario(id: string): Observable<UsuarioPermisosResponseDto> {
    return this.http.get<UsuarioPermisosResponseDto>(`${this.urlBase}/${id}`);
  }

  public postUsuario(upsertUsuario: CrearUsuarioUpsertDto): Observable<void> {
    return this.http.post<void>(this.urlBase, upsertUsuario);
  }

  public activateUsuario(id: string): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/${id}/activar`, {});
  }

  public deactivateUsuario(id: string): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/${id}/desactivar`, {});
  }

  public putNombreCompleto(id: string, dto: CambiarNombreCompletoUpsertDto): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/${id}/nombre-completo`, dto);
  }

  public putPassword(id: string, dto: CambiarPasswordUpsertDto): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/${id}/password`, dto);
  }

  public putRol(id: string, dto: CambiarRolUpsertDto): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/${id}/rol`, dto);
  }

}
