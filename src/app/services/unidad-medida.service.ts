import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { UnidadMedidaResponseDto } from '../models/dtos/responses/unidad-medida-response-dto';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/UnidadMedida';

  public getUnidadesMedida(): Observable<UnidadMedidaResponseDto[]>{
    return this.http.get<UnidadMedidaResponseDto[]>(this.urlBase + '/listar_unidades_medida')
  }

  public getUnidadMedida(id: number): Observable<UnidadMedidaResponseDto>{
    return this.http.get<UnidadMedidaResponseDto>(`${this.urlBase}/obtener_unidad_medida/${id}`)
  }
}
