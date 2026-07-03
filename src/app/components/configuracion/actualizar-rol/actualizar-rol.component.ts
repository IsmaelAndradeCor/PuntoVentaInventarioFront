import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RolService } from '../../../services/rol.service';
import { RolResponseDto } from '../../../models/dtos/responses/rol-response-dto';
import { RolUpsertDto } from '../../../models/dtos/requests/rol-upsert-dto';

@Component({
  selector: 'app-actualizar-rol',
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-rol.component.html',
  styleUrl: './actualizar-rol.component.scss'
})
export class ActualizarRolComponent implements OnInit {

  @ViewChild('inputNombre') inputNombre!: ElementRef<HTMLInputElement>;

  constructor(
    private rolService: RolService,
    private toastrService: ToastrService
  ){}

  @Input() rolActualizar: RolResponseDto | null = null;
  @Input() mostrarActualizarRol = false;

  @Output() cerrarModal = new EventEmitter<void>();
  @Output() objetoActualizado = new EventEmitter<RolResponseDto>();

  upsertRol: RolUpsertDto = {
    nombre: '',
    esAdmin: false
  }

  ngOnInit(): void {
    if (this.rolActualizar) {
      this.upsertRol.nombre = this.rolActualizar.nombre;
      this.upsertRol.esAdmin = this.rolActualizar.esAdmin;
    }
  }

  ngAfterViewInit(): void {
    this.enfocarInputNombre();
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: Event): void {
    event.preventDefault();
    this.guardarCambios();
  }

  private enfocarInputNombre(): void {
    setTimeout(() => {
      this.inputNombre?.nativeElement.focus();
      this.inputNombre?.nativeElement.select();
    }, 0);
  }

  cerrar() {
    this.cerrarModal.emit();
  }

  guardarCambios() {
    if (!this.rolActualizar) return;

    this.rolService.putRol(this.rolActualizar.id, this.upsertRol).subscribe({
      next: (response) => {
        this.toastrService.success('Rol actualizado correctamente.');
        this.objetoActualizado.emit(response);
        this.cerrarModal.emit();
      },
      error: (err) => {
        this.toastrService.error(err.error?.mensaje || 'Error al actualizar el rol.');
      }
    });
  }
}
