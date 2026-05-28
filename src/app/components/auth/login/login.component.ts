import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  userName = '';
  password = '';
  cargando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.authService.clearSession();
  }

  iniciarSesion(): void {
    if (!this.userName.trim() || !this.password.trim()) {
      this.toastrService.warning('Usuario y contraseña son obligatorios.');
      return;
    }

    this.cargando = true;

    this.authService.login({
      userName: this.userName,
      password: this.password
    }).subscribe({
      next: () => {
        this.cargando = false;

        if (this.authService.hasPermission('home.ver')) {
          this.router.navigate(['/home']);
          return;
        }

        if (this.authService.hasPermission('ventas.realizar')) {
          this.router.navigate(['/venta/realizar-venta']);
          return;
        }

        this.router.navigate(['/sin-acceso']);
      },
      error: () => {
        this.cargando = false;
      }
    });
  }
}