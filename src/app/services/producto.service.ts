import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { ProductoDto } from '../models/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor() { }

  private http = inject(HttpClient);
  private urlBase = environment.apiURL + '/Producto';

  public getProductos(): Observable<ProductoDto[]> {
    return this.http.get<ProductoDto[]>(this.urlBase + '/listar_productos');
  }

  public getProductosStockMinimo(): Observable<ProductoDto[]> {
    return this.http.get<ProductoDto[]>(this.urlBase + '/stock_minimo');
  }

  public getProductoPorCodigo(codigo: string): Observable<ProductoDto> {
    return this.http.get<ProductoDto>(`${this.urlBase}/producto_codigo/${codigo}`);
  }

  public postProducto(producto: ProductoDto): Observable<void> {
    return this.http.post<void>(this.urlBase + '/crear_producto', producto);
  }

  public putProducto(codigo: string, producto: ProductoDto): Observable<void> {
    return this.http.put<void>(`${this.urlBase}/actualizar_producto/${codigo}`, producto);
  }

  public deleteProducto(codigo: string): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/eliminar_producto/${codigo}`);
  }
}
