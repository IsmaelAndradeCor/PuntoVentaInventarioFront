import { inject, Injectable } from '@angular/core';
import { VentaDto } from '../models/venta';
import { DetalleVentaDto } from '../models/detalle-venta';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RegistrarVentaResponseDto } from '../models/dtos/responses/registrar-venta-response-dto';
import { GenerarVentaResponseDto } from '../models/dtos/responses/generar-venta-response-dto';
import { GenerarVentasRequestDto } from '../models/dtos/requests/generar-ventas-request-dto';
import { MetodosPagoResponseDto } from '../models/dtos/responses/metodos-pago-response-dto';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/Venta';

  public registrarVenta(venta: VentaDto): Observable<RegistrarVentaResponseDto> {
    return this.http.post<RegistrarVentaResponseDto>(`${this.urlBase}/realizar_venta`, venta);
  }

  getGenerarVentas(filtros: GenerarVentasRequestDto): Observable<GenerarVentaResponseDto[]> {
    let params = new HttpParams();

    if (filtros.fechaInicio) {
      params = params.set('FechaInicio', filtros.fechaInicio);
    }

    if (filtros.fechaFin) {
      params = params.set('FechaFin', filtros.fechaFin);
    }

    params = params.set('IncluirDetalle', filtros.incluirDetalle);

    if (filtros.idMarca) {
      params = params.set('IdMarca', filtros.idMarca);
    }

    if (filtros.idProveedor) {
      params = params.set('IdProveedor', filtros.idProveedor);
    }

    if (filtros.detallesFiltrados) {
      params = params.set('DetallesFiltrados', 'true');
    }

    return this.http.get<GenerarVentaResponseDto[]>(`${this.urlBase}/generar_ventas`, { params });
  }

  getMetodosPago(): Observable<MetodosPagoResponseDto[]> {
    return this.http.get<MetodosPagoResponseDto[]>(this.urlBase + '/obtener-metodos-pago');
  }
}
