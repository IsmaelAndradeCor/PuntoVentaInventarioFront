import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Para ngModel
import { Producto } from '../../../models/producto.interface';

@Component({
  selector: 'app-actualizar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-producto.component.html',
  styleUrl: './actualizar-producto.component.scss'
})
export class ActualizarProductoComponent {
  @Input() productoActualizar: Producto | null = null;  // Quita required si inicializas
  @Input() mostrarActualizarProducto = false;

  @Output() cerrarModal = new EventEmitter<void>();  // ← Output correcto para cerrar

  cerrar() {
    this.cerrarModal.emit();  // Emite evento al padre
  }

  guardarCambios() {
    // Lógica de actualización (ej. API call)
    if (this.productoActualizar) {
      console.log('Actualizando:', this.productoActualizar);
    }
    this.cerrar();
  }
}
