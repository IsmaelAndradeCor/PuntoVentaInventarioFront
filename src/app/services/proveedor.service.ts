import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProveedorResponseDto } from '../models/dtos/responses/proveedor-response-dto';
import { ProveedorUpsertDto } from '../models/dtos/requests/proveedor-upsert-dto';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/Proveedor';

  // Devuelve un arreglo de Proveedores
  public getProveedoresActivos(): Observable<ProveedorResponseDto[]> {
    return this.http.get<ProveedorResponseDto[]>(this.urlBase + '/listar_proveedores_activos');
  }

  // Devuelve un arreglo de Proveedores
  public getProveedoresInactivos(): Observable<ProveedorResponseDto[]> {
    return this.http.get<ProveedorResponseDto[]>(this.urlBase + '/listar_proveedores_inactivos');
  }

  // Devuelve un objeto de Proveedor
  public getProveedorPorId(idProveedor: number): Observable<ProveedorResponseDto> {
    return this.http.get<ProveedorResponseDto>(`${this.urlBase}/obtener_proveedor/${idProveedor}`);
  }

  // Inserta un Proveedor y devuelve el proveedor insertado
  public postProveedor(proveedorUpsertDto: ProveedorUpsertDto): Observable<ProveedorResponseDto> {
    return this.http.post<ProveedorResponseDto>(this.urlBase + '/crear_proveedor', proveedorUpsertDto);
  }

  // Actualiza un Proveedor y devuelve el proveedor actualizado
  public putProveedor(idProveedor: number, proveedorUpsertDto: ProveedorUpsertDto): Observable<ProveedorResponseDto> {
    return this.http.put<ProveedorResponseDto>(`${this.urlBase}/actualizar_proveedor/${idProveedor}`, proveedorUpsertDto);
  }

  // Desactiva con soft delete a partir del idProveedor
  public activateProveedor(idProveedor: number): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/activar_proveedor/${idProveedor}`, {});
  }
  // Desactiva con soft delete a partir del idProveedor
  public deactivateProveedor(idProveedor: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/desactivar_proveedor/${idProveedor}`);
  }

}
