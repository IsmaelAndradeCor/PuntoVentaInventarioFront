import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { LoginRequestDto, LoginResponseDto, JwtPayload } from './auth-models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly urlBase = `${environment.apiURL}/Auth`;
  private readonly tokenKey = 'pvi_token';

  private currentTokenSignal = signal<string | null>(localStorage.getItem(this.tokenKey));
  private currentUserSignal = signal<JwtPayload | null>(this.getPayloadFromStorage());

  isAuthenticated = computed(() => {
    const token = this.currentTokenSignal();
    if (!token) return false;

    const payload = this.currentUserSignal();
    if (!payload?.exp) return false;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp > nowInSeconds;
  });

  userName = computed(() => this.currentUserSignal()?.unique_name ?? '');
  nombreCompleto = computed(() => this.currentUserSignal()?.nombreCompleto ?? '');
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

  constructor(private http: HttpClient) {}

  login(dto: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.urlBase}/login`, dto).pipe(
      tap(response => this.setSession(response.token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentTokenSignal.set(null);
    this.currentUserSignal.set(null);
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
}