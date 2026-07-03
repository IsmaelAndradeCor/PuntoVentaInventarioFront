export interface LoginRequestDto {
  userName: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  expiration: string;
  userName: string;
  nombreCompleto: string;
  roles: string[];
}

export interface JwtPayload {
  sub?: string;
  unique_name?: string;
  nombreCompleto?: string;
  esAdmin?: string;
  role?: string | string[];
  permission?: string | string[];
  exp?: number;
  nbf?: number;
  [key: string]: unknown;
}