import { Component } from '@angular/core';
import { ProveedorService } from '../../../services/proveedor.service';
import { ToastrService } from 'ngx-toastr';
import { ProveedorResponseDto } from '../../../models/dtos/responses/proveedor-response-dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { HasPermissionDirective } from '../../../core/directives/has-permission.directive';

@Component({
  selector: 'app-listar-proveedores-inactivos',
  imports: [FormsModule, CommonModule, ConfirmarModalComponent, HasPermissionDirective],
  templateUrl: './listar-proveedores-inactivos.component.html',
  styleUrl: './listar-proveedores-inactivos.component.scss'
})
export class ListarProveedoresInactivosComponent {

  constructor(
    private proveedorService: ProveedorService,
    private toastrService: ToastrService
  ){}

  proveedores: ProveedorResponseDto[] = [];
  proveedoresFiltrados: ProveedorResponseDto[] = [];

  proveedorActualizar: ProveedorResponseDto | null = null;;
  mostrarActualizarProveedor: boolean = false;

  mostrarConfirmarActivar: boolean = false;
  idProveedorActivar: number | null = null;

  proveedoresPorId: Map<number, ProveedorResponseDto> = new Map();  // ← Tu diccionario

  textoBusqueda: string = '';
  
  ngOnInit() {
    this.getProveedoresInactivos();
  }

  getProveedoresInactivos(): void {
    this.proveedorService.getProveedoresInactivos().subscribe({
      next:(response) => {
        this.proveedores = response;
        this.proveedoresFiltrados = [...this.proveedores];
        this.proveedoresPorId = new Map (
          this.proveedores.map(proveedor => [proveedor.id, proveedor])
        );
      }
    });
  }

  trackByProveedorId(index: number, item: ProveedorResponseDto): number {
    return item.id;
  }

  activarProveedorPorCodigo(id: number): void {

    this.proveedorService.activateProveedor(id).subscribe({
      next:() => {
        this.proveedoresPorId.delete(id);

        this.proveedores = this.proveedores.filter(x => x.id !== id);
        this.filtrarTabla();

        this.toastrService.success('Proveedor activado con éxito.')
      }
    });
  }

  abrirModalActualizarProveedorPorId(idProveedor: number): void {
    this.proveedorService.getProveedorPorId(idProveedor).subscribe({
      next: (response) => {
        this.proveedorActualizar = response;
        this.mostrarActualizarProveedor = true;
      }
    });
  }

  cerrarModalActualizar(): void {
    this.mostrarActualizarProveedor = false;
    this.proveedorActualizar = null;
  }

  actualizarEnLista(objetoActualizado: ProveedorResponseDto): void {
    const index = this.proveedores.findIndex(m => m.id === objetoActualizado.id);

    if (index !== -1) {
      this.proveedores[index] = objetoActualizado;
      this.proveedoresFiltrados = [...this.proveedores];
      this.filtrarTabla();
    }

    this.cerrarModalActualizar();
  }

  mostrarModalConfirmarActivar(id: number): void {
    this.idProveedorActivar = id;
    this.mostrarConfirmarActivar = true;
  }

  cerrarModalConfirmar(): void {
    this.mostrarConfirmarActivar = false;
    this.idProveedorActivar = null;
  }

  filtrarTabla(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();

    if (!texto) {
      this.proveedoresFiltrados = [...this.proveedores];
      return;
    }

    this.proveedoresFiltrados = this.proveedores.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );
  }

  limpiarTextoBusqueda(): void {
    this.textoBusqueda = '';
    this.filtrarTabla();
  }
}
