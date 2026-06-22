import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProductoUpsertDto } from '../models/dtos/requests/producto-upsert-dto';
import { ProductoResponseDto } from '../models/dtos/responses/producto-response-dto';
import { ProductoSimpleResponseDto } from '../models/dtos/responses/producto-simple-response-dto';
import { PagedResultDto } from '../models/dtos/responses/paged-result-dto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/Producto';

  public getProductosActivos(page: number = 1, pageSize: number = 20, search?: string): Observable<PagedResultDto<ProductoResponseDto>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PagedResultDto<ProductoResponseDto>>(this.urlBase + '/listar_productos_activos', { params });
  }

  public getProductosVenta(): Observable<ProductoSimpleResponseDto[]> {
    return this.http.get<ProductoSimpleResponseDto[]>(this.urlBase + '/listar_productos_venta');
  }

  public getProductosInactivos(): Observable<ProductoResponseDto[]> {
    return this.http.get<ProductoResponseDto[]>(this.urlBase + '/listar_productos_inactivos');
  }

  public getProductosStockMinimo(): Observable<ProductoResponseDto[]> {
    return this.http.get<ProductoResponseDto[]>(this.urlBase + '/stock_minimo');
  }

  public getProductoPorCodigo(codigo: string): Observable<ProductoResponseDto> {
    return this.http.get<ProductoResponseDto>(`${this.urlBase}/producto_codigo/${codigo}`);
  }

  public postProducto(producto: ProductoUpsertDto): Observable<void> {
    return this.http.post<void>(this.urlBase + '/crear_producto', producto);
  }

  public putProducto(producto: ProductoUpsertDto): Observable<ProductoResponseDto> {
    return this.http.put<ProductoResponseDto>(`${this.urlBase}/actualizar_producto`, producto);
  }

  public activateProducto(idProducto: number): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/activar_producto/${idProducto}`, {});
  }
  
  public deactivateProducto(idProducto: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/desactivar_producto/${idProducto}`);
  }
}
