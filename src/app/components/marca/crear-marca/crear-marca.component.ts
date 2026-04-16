import { Component } from '@angular/core';
import { MarcaUpsertDto } from '../../../models/dtos/requests/marca-upsert-dto';
import { FormsModule } from '@angular/forms';
import { MarcaService } from '../../../services/marca.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-marca',
  imports: [FormsModule],
  templateUrl: './crear-marca.component.html',
  styleUrl: './crear-marca.component.scss'
})
export class CrearMarcaComponent {

  constructor(private marcaService: MarcaService,
      private toastrService: ToastrService){}

  marcaUpsertDto: MarcaUpsertDto = {
    nombre : ''
  }

  crearMarca(): void {
    this.marcaService.postMarca(this.marcaUpsertDto).subscribe({
      next:(response) => {
        this.toastrService.success('Marca ' + response.nombre + ' creada correctamente.');
      },
      error:(error) => {
        console.error(error);
      }
    })
  }

}
