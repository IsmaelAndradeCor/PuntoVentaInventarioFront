import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { ProductoDto } from '../../models/producto.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(
    private productoService: ProductoService
  ) {}

  productos: ProductoDto[] = [];

  ngOnInit(): void {
    this.getProductosStockMinimo();
  }

  getProductosStockMinimo(): void {
    this.productoService.getProductosStockMinimo().subscribe({
      next:(res) => {
        this.productos = res;
      }
    })
  }
}
