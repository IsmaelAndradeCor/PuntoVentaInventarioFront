import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { UnidadMedidaResponseDto } from '../models/dtos/responses/unidad-medida-response-dto';
import { UnidadMedidaUpsertDto } from '../models/dtos/requests/unidad-medida-upsert-dto';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/UnidadMedida';

  // Devuelve un arreglo de Unidades de Medida
  public getUnidadesMedidaActivas(): Observable<UnidadMedidaResponseDto[]> {
    return this.http.get<UnidadMedidaResponseDto[]>(this.urlBase + '/listar_unidades_medida_activas');
  }

  // Devuelve un arreglo de Unidades de Medida
  public getUnidadesMedidaInactivas(): Observable<UnidadMedidaResponseDto[]> {
    return this.http.get<UnidadMedidaResponseDto[]>(this.urlBase + '/listar_unidades_medida_inactivas');
  }

  // Devuelve un objeto de Unidad de Medida
  public getUnidadMedida(idUnidadMedida: number): Observable<UnidadMedidaResponseDto> {
    return this.http.get<UnidadMedidaResponseDto>(`${this.urlBase}/obtener_unidad_medida/${idUnidadMedida}`);
  }

  // Inserta una Unidad de Medida y devuelve la unidad insertada
  public postUnidadMedida(unidadMedidaUpsertDto: UnidadMedidaUpsertDto): Observable<UnidadMedidaResponseDto> {
    return this.http.post<UnidadMedidaResponseDto>(this.urlBase + '/crear_unidad_medida', unidadMedidaUpsertDto);
  }

  // Actualiza una Unidad de Medida y devuelve la unidad actualizada
  public putUnidadMedida(idUnidadMedida: number, unidadMedidaUpsertDto: UnidadMedidaUpsertDto): Observable<UnidadMedidaResponseDto> {
    return this.http.put<UnidadMedidaResponseDto>(`${this.urlBase}/actualizar_unidad_medida/${idUnidadMedida}`, unidadMedidaUpsertDto);
  }

  // Desactiva con soft delete a partir del idUnidadMedida
  public activateUnidadMedida(idUnidadMedida: number): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/activar_unidad_medida/${idUnidadMedida}`, {});
  }
  
  // Desactiva con soft delete a partir del idUnidadMedida
  public deactivateUnidadMedida(idUnidadMedida: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/desactivar_unidad_medida/${idUnidadMedida}`);
  }
}
