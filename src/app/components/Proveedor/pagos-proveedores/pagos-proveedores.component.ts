import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProveedorService } from '../../../services/proveedor.service';
import { PagosProveedoresResponseDto } from '../../../models/dtos/responses/pagos-proveedores-response-dto';

@Component({
  selector: 'app-pagos-proveedores',
  imports: [FormsModule, CommonModule],
  templateUrl: './pagos-proveedores.component.html',
  styleUrl: './pagos-proveedores.component.scss'
})
export class PagosProveedoresComponent implements OnInit {
  constructor(private toastrService: ToastrService, private proveedorService: ProveedorService){}

  pagosProveedores: PagosProveedoresResponseDto [] = [];

  ngOnInit(): void {
    this.getPagosProveedores();
  }

  getPagosProveedores() {
    this.proveedorService.getPagosProveedores().subscribe({
      next:(response) => {
        this.pagosProveedores = response;
      }
    })
  }
}
