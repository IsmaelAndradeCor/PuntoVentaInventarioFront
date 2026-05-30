import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AperturaCajaResponseDto } from '../models/dtos/responses/apertura-caja-response-dto';
import { RegistrarAperturaCajaUpsertDto } from '../models/dtos/requests/registrar-apertura-caja-upsert-dto';
import { CorteCajaHoyResponseDto } from '../models/dtos/responses/corte-caja-hoy-response-dto';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  private readonly urlBase = `${environment.apiURL}/Caja`;

  constructor(private http: HttpClient) {}

  obtenerAperturaHoy(): Observable<AperturaCajaResponseDto> {
    return this.http.get<AperturaCajaResponseDto>(`${this.urlBase}/apertura_hoy`);
  }

  registrarApertura(request: RegistrarAperturaCajaUpsertDto): Observable<AperturaCajaResponseDto> {
    return this.http.post<AperturaCajaResponseDto>(`${this.urlBase}/registrar_apertura`, request);
  }

  obtenerCorteHoy(): Observable<CorteCajaHoyResponseDto> {
    return this.http.get<CorteCajaHoyResponseDto>(`${this.urlBase}/obtener_corte_hoy`);
  }
}