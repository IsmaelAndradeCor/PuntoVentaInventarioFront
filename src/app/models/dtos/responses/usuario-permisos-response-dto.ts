export interface UsuarioPermisosResponseDto {
    id: string
    userName: string
    nombreCompleto: string
    activo: boolean
    roles: string[]
    permissions: string[]
}
