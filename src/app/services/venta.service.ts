import { inject, Injectable } from '@angular/core';
import { VentaDto } from '../models/venta';
import { DetalleVentaDto } from '../models/detalle-venta';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GenerarVentasDTO } from '../models/generar-ventas-dto';
import { RegistrarVentaResponseDto } from '../models/dtos/responses/registrar-venta-response-dto';

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

  public getGenerarVentas(): Observable<GenerarVentasDTO[]> {
    return this.http.get<GenerarVentasDTO[]>(`${this.urlBase}/generar_ventas`);
  }
}
