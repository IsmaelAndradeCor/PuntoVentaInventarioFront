export interface PermisoNodoDto {
  key: string;
  titulo: string;
  permission?: string;
  hijos: PermisoNodoDto[];
}