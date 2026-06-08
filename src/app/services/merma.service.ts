import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { RegistrarMermaUpsertDto } from '../models/dtos/requests/registrar-merma-upsert-dto';
import { RegistrarMermaResponseDto } from '../models/dtos/responses/registrar-merma-response-dto';
import { MermaResponseDto } from '../models/dtos/responses/merma-response-dto';

@Injectable({
  providedIn: 'root'
})
export class MermaService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/Merma';

  public registrarMerma(merma: RegistrarMermaUpsertDto): Observable<RegistrarMermaResponseDto> {
    return this.http.post<RegistrarMermaResponseDto>(`${this.urlBase}/registrar_merma`, merma);
  }

  public getMermas(fechaInicio?: string, fechaFin?: string): Observable<MermaResponseDto[]> {
    let params = new HttpParams();

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }

    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    return this.http.get<MermaResponseDto[]>(`${this.urlBase}/listar_mermas`, { params });
  }
}
