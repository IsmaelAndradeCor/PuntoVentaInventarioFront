import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UsuarioPermisosResponseDto } from '../models/dtos/responses/usuario-permisos-response-dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/Usuarios';

  public getUsuarios(): Observable<UsuarioPermisosResponseDto[]> {
    return this.http.get<UsuarioPermisosResponseDto[]>(this.urlBase)
  }

}
