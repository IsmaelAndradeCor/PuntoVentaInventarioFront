import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../../services/proveedor.service';
import { ToastrService } from 'ngx-toastr';
import { ProveedorResponseDto } from '../../../models/dtos/responses/proveedor-response-dto';
import { RegistrarPagoProveedorUpsertDto } from '../../../models/dtos/requests/registrar-pago-proveedor-upsert-dto';

@Component({
  selector: 'app-pagar-proveedor',
  imports: [FormsModule, CommonModule],
  templateUrl: './pagar-proveedor.component.html',
  styleUrl: './pagar-proveedor.component.scss'
})
export class PagarProveedorComponent implements OnInit {

  constructor(private proveedorService: ProveedorService, private toastrService: ToastrService){}

  proveedoresActivos: ProveedorResponseDto [] = [];

  registrarPago: RegistrarPagoProveedorUpsertDto = {
    idProveedor: 0,
    monto: 0,
    metodoPago: 'Efectivo',
    referencia: '',
    observaciones: ''
  };

  ngOnInit(): void {
    this.getProveedoresActivos();
  }

  getProveedoresActivos() {
    this.proveedorService.getProveedoresActivos().subscribe({
      next:(response) => {
        this.proveedoresActivos = response;
      }
    })
  }

  postPagoProveedor() {
    this.proveedorService.registrarPagoProveedor(this.registrarPago!).subscribe({
      next:(response) => {
      this.registrarPago = {
        idProveedor: 0,
        monto: 0,
        metodoPago: 'Efectivo',
        referencia: '',
        observaciones: ''
      };
        this.toastrService.success(`Pago ${response.folio} registrado con éxito!`, 'Éxito!');
      }
    })
  }
}
