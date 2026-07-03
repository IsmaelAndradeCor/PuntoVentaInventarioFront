import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequestDto, LoginResponseDto, JwtPayload } from './auth-models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly urlBase = `${environment.apiURL}/Auth`;
  private readonly tokenKey = 'pvi_token';

  private currentTokenSignal = signal<string | null>(localStorage.getItem(this.tokenKey));
  private currentUserSignal = signal<JwtPayload | null>(this.getPayloadFromStorage());
  private logoutInProgress = false;

  isAuthenticated = computed(() => !this.isTokenExpired());

  userName = computed(() => this.currentUserSignal()?.unique_name ?? '');
  nombreCompleto = computed(() => this.currentUserSignal()?.nombreCompleto ?? '');

  esAdmin = computed(() => {
    const payload = this.currentUserSignal();
    return payload?.esAdmin === 'true';
  });

  roles = computed<string[]>(() => {
    const payload = this.currentUserSignal();
    if (!payload) return [];

    const roleClaim =
      payload['role'] ??
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!roleClaim) return [];

    return Array.isArray(roleClaim) ? roleClaim as string[] : [roleClaim as string];
  });

  permissions = computed<string[]>(() => {
    const payload = this.currentUserSignal();
    if (!payload) return [];

    const permissionClaim = payload['permission'];
    if (!permissionClaim) return [];

    return Array.isArray(permissionClaim)
      ? permissionClaim as string[]
      : [permissionClaim as string];
  });

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(dto: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.urlBase}/login`, dto).pipe(
      tap(response => this.setSession(response.token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentTokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.logoutInProgress = false;
    this.router.navigate(['/login']);
  }

  forceLogoutIfExpired(): boolean {
    if (!this.getToken()) return false;

    if (this.isTokenExpired()) {
      this.handleUnauthorized();
      return true;
    }

    return false;
  }

  getToken(): string | null {
    return this.currentTokenSignal();
  }

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  handleUnauthorized(): void {
    if (this.logoutInProgress) return;

    this.logoutInProgress = true;
    localStorage.removeItem(this.tokenKey);
    this.currentTokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  private setSession(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.currentTokenSignal.set(token);
    this.currentUserSignal.set(this.decodeToken(token));
  }

  private getPayloadFromStorage(): JwtPayload | null {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return null;
    return this.decodeToken(token);
  }

  isTokenExpired(): boolean {
    const token = this.currentTokenSignal();
    const payload = this.currentUserSignal();

    if (!token || !payload?.exp) return true;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowInSeconds;
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) return null;

      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(payloadJson) as JwtPayload;
    } catch {
      return null;
    }
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentTokenSignal.set(null);
    this.currentUserSignal.set(null);
    this.logoutInProgress = false;
  }
}