import { Component } from '@angular/core';
import { ProveedorService } from '../../../services/proveedor.service';
import { ToastrService } from 'ngx-toastr';
import { ProveedorResponseDto } from '../../../models/dtos/responses/proveedor-response-dto';
import { FormsModule } from '@angular/forms';
import { ConfirmarModalComponent } from '../../../modals/confirmar-modal/confirmar-modal.component';
import { CommonModule } from '@angular/common';
import { ActualizarProveedorComponent } from '../actualizar-proveedor/actualizar-proveedor.component';
import { HasPermissionDirective } from "../../../core/directives/has-permission.directive";

@Component({
  selector: 'app-listar-proveedores',
  imports: [FormsModule, CommonModule, ConfirmarModalComponent, ActualizarProveedorComponent, HasPermissionDirective],
  templateUrl: './listar-proveedores.component.html',
  styleUrl: './listar-proveedores.component.scss'
})
export class ListarProveedoresComponent {

  constructor(
    private proveedorService: ProveedorService,
    private toastrService: ToastrService
  ){}

  proveedores: ProveedorResponseDto[] = [];
  proveedoresFiltrados: ProveedorResponseDto[] = [];

  proveedorActualizar: ProveedorResponseDto | null = null;;
  mostrarActualizarProveedor: boolean = false;

  mostrarConfirmarDesactivar: boolean = false;
  idProveedorDesactivar: number | null = null;

  proveedoresPorId: Map<number, ProveedorResponseDto> = new Map();  // ← Tu diccionario

  textoBusqueda: string = '';
  
  ngOnInit() {
    this.getProveedoresActivos();
  }

  getProveedoresActivos(): void {
    this.proveedorService.getProveedoresActivos().subscribe({
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

  desactivarProveedorPorCodigo(id: number): void {

    this.proveedorService.deactivateProveedor(id).subscribe({
      next:() => {
        this.proveedoresPorId.delete(id);

        this.proveedores = this.proveedores.filter(x => x.id !== id);
        this.filtrarTabla();

        this.toastrService.success('Proveedor desactivado con éxito.')
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

  mostrarModalConfirmarDesactivar(id: number): void {
    this.idProveedorDesactivar = id;
    this.mostrarConfirmarDesactivar = true;
  }

  cerrarModalConfirmar(): void {
    this.mostrarConfirmarDesactivar = false;
    this.idProveedorDesactivar = null;
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
