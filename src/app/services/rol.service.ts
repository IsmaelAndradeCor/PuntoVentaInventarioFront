import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { RolResponseDto } from '../models/dtos/responses/rol-response-dto';
import { RolUpsertDto } from '../models/dtos/requests/rol-upsert-dto';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/Roles';

  public getRolesActivos(): Observable<RolResponseDto[]> {
    return this.http.get<RolResponseDto[]>(this.urlBase + '/listar_roles_activos');
  }

  public getRolesInactivos(): Observable<RolResponseDto[]> {
    return this.http.get<RolResponseDto[]>(this.urlBase + '/listar_roles_inactivos');
  }

  public getRol(id: string): Observable<RolResponseDto> {
    return this.http.get<RolResponseDto>(`${this.urlBase}/obtener_rol/${id}`);
  }

  public postRol(dto: RolUpsertDto): Observable<RolResponseDto> {
    return this.http.post<RolResponseDto>(this.urlBase + '/crear_rol', dto);
  }

  public putRol(id: string, dto: RolUpsertDto): Observable<RolResponseDto> {
    return this.http.put<RolResponseDto>(`${this.urlBase}/actualizar_rol/${id}`, dto);
  }

  public activateRol(id: string): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/activar_rol/${id}`, {});
  }

  public deactivateRol(id: string): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/desactivar_rol/${id}`, {});
  }
}
