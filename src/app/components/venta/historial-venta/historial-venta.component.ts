import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../../services/venta.service';
import { MarcaService } from '../../../services/marca.service';
import { ProveedorService } from '../../../services/proveedor.service';
import { GenerarVentaResponseDto } from '../../../models/dtos/responses/generar-venta-response-dto';
import { MarcaResponseDto } from '../../../models/dtos/responses/marca-response-dto';
import { ProveedorResponseDto } from '../../../models/dtos/responses/proveedor-response-dto';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial-venta',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historial-venta.component.html',
  styleUrl: './historial-venta.component.scss'
})
export class HistorialVentaComponent implements OnInit {

  constructor(
    private ventaService: VentaService,
    private marcaService: MarcaService,
    private proveedorService: ProveedorService,
    private fb: FormBuilder
  ){}

  filtroForm!: FormGroup;
  ventas: GenerarVentaResponseDto[] = [];
  ventaExpandidaId: number | null = null;
  cargando = false;
  marcas: MarcaResponseDto[] = [];
  proveedores: ProveedorResponseDto[] = [];
  errorMarcas = false;
  errorProveedores = false;

  get tieneFiltroMarcaOProveedor(): boolean {
    return !!this.filtroForm?.get('idMarca')?.value || !!this.filtroForm?.get('idProveedor')?.value;
  }

  get detalleFiltradoActivo(): boolean {
    return this.tieneFiltroMarcaOProveedor && !!this.filtroForm?.get('detallesFiltrados')?.value;
  }

  ngOnInit(): void {
    const fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());

    const hoy = fecha.toISOString().split('T')[0];

    this.filtroForm = this.fb.group({
      fechaInicio: [hoy],
      fechaFin: [hoy],
      incluirDetalle: [true],
      idMarca: [null],
      idProveedor: [null],
      detallesFiltrados: [false]
    });

    this.cargarMarcas();
    this.cargarProveedores();
    this.buscarVentas();
  }

  private cargarMarcas(): void {
    this.marcaService.getMarcasActivas().subscribe({
      next: (marcas) => {
        this.marcas = marcas;
        this.errorMarcas = false;
      },
      error: () => {
        this.errorMarcas = true;
      }
    });
  }

  private cargarProveedores(): void {
    this.proveedorService.getProveedoresActivos().subscribe({
      next: (proveedores) => {
        this.proveedores = proveedores;
        this.errorProveedores = false;
      },
      error: () => {
        this.errorProveedores = true;
      }
    });
  }

  buscarVentas(): void {
    const filtros = this.filtroForm.value;

    this.cargando = true;
    this.ventaExpandidaId = null;

    this.ventaService.getGenerarVentas({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
      incluirDetalle: filtros.incluirDetalle,
      idMarca: filtros.idMarca ?? null,
      idProveedor: filtros.idProveedor ?? null,
      detallesFiltrados: filtros.detallesFiltrados ?? false
    }).subscribe({
      next: (resp: GenerarVentaResponseDto[]) => {
        this.ventas = resp ?? [];
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  toggleDetalle(venta: GenerarVentaResponseDto): void {
    if (!this.filtroForm.get('incluirDetalle')?.value) {
      return;
    }

    this.ventaExpandidaId = this.ventaExpandidaId === venta.idVenta
      ? null
      : venta.idVenta;
  }

  estaExpandida(venta: GenerarVentaResponseDto): boolean {
    return this.ventaExpandidaId === venta.idVenta;
  }

  trackByVenta(index: number, venta: GenerarVentaResponseDto): number {
    return venta.idVenta;
  }

  calcularTotalCostos(): number {
    return this.ventas.reduce((total, venta) => total + venta.costoTotal, 0);
  }

  calcularTotalVentas(): number {
    return this.ventas.reduce((total, venta) => total + venta.total, 0);
  }

  calcularTotalGanancias(): number {
    return this.ventas.reduce((total, venta) => total + venta.ganancias, 0);
  }
}
