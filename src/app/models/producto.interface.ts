// producto.interface.ts
export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  precioCompra: number;     // ← NUEVO: Costo real de compra
  precioVenta: number;      // ← NUEVO: Precio al público (antes era solo "precio")
  stock: number;
  stockMinimo: number;
  categoria: string | null;
  proveedor: string | null;
  fechaCreacion: string;
}

// producto.interface.ts
export interface ProductoDto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  categoria?: string;
  proveedor?: string;
}


// datos-mock.ts - COMPLETO con precios de compra/venta
export const productosMock: Producto[] = [
  {
    id: 1,
    codigo: 'ART001',
    nombre: 'Laptop Dell Inspiron',
    descripcion: '15" i5 8GB SSD',
    precioCompra: 12000.00,   // 💵 Costo real
    precioVenta: 15000.00,    // 💰 Precio público
    stock: 5,
    stockMinimo: 2,
    categoria: 'Electrónicos',
    proveedor: 'Dell México',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 2,
    codigo: 'ART002',
    nombre: 'Mouse Logitech',
    descripcion: 'Óptico inalámbrico',
    precioCompra: 180.00,
    precioVenta: 250.00,
    stock: 20,
    stockMinimo: 5,
    categoria: 'Electrónicos',
    proveedor: 'Logitech',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 3,
    codigo: 'ART003',
    nombre: 'Teclado Mecánico',
    descripcion: 'RGB USB',
    precioCompra: 600.00,
    precioVenta: 800.00,
    stock: 10,
    stockMinimo: 3,
    categoria: 'Electrónicos',
    proveedor: 'HyperX',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 4,
    codigo: 'ART004',
    nombre: 'Monitor 24"',
    descripcion: 'Full HD IPS',
    precioCompra: 3600.00,
    precioVenta: 4500.00,
    stock: 8,
    stockMinimo: 2,
    categoria: 'Electrónicos',
    proveedor: 'Samsung',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 5,
    codigo: 'ART005',
    nombre: 'Impresora HP',
    descripcion: 'Laser B/N',
    precioCompra: 2400.00,
    precioVenta: 3000.00,
    stock: 3,
    stockMinimo: 1,
    categoria: 'Electrónicos',
    proveedor: 'HP',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 6,
    codigo: 'ART006',
    nombre: 'Cuaderno 100hjs',
    descripcion: 'Rayado A4',
    precioCompra: 18.00,
    precioVenta: 25.00,
    stock: 100,
    stockMinimo: 20,
    categoria: 'Papelería',
    proveedor: 'Norica',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 7,
    codigo: 'ART007',
    nombre: 'Bolígrafo Pilot',
    descripcion: 'Azul pack 12',
    precioCompra: 36.00,
    precioVenta: 50.00,
    stock: 50,
    stockMinimo: 10,
    categoria: 'Papelería',
    proveedor: 'Pilot',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 8,
    codigo: 'ART008',
    nombre: 'Carpetas Plásticas',
    descripcion: 'A4 transparentes pack 5',
    precioCompra: 60.00,
    precioVenta: 80.00,
    stock: 30,
    stockMinimo: 10,
    categoria: 'Papelería',
    proveedor: 'Office Depot',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 9,
    codigo: 'ART009',
    nombre: 'Arroz 1kg',
    descripcion: 'Blanco integral',
    precioCompra: 15.00,
    precioVenta: 20.00,
    stock: 40,
    stockMinimo: 10,
    categoria: 'Alimentos',
    proveedor: 'La Corona',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 10,
    codigo: 'ART010',
    nombre: 'Aceite 900ml',
    descripcion: 'Vegetal',
    precioCompra: 28.00,
    precioVenta: 35.00,
    stock: 25,
    stockMinimo: 5,
    categoria: 'Alimentos',
    proveedor: 'Coppel',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 11,
    codigo: 'ART011',
    nombre: 'Refresco 2L',
    descripcion: 'Coca Cola',
    precioCompra: 14.00,
    precioVenta: 18.00,
    stock: 60,
    stockMinimo: 15,
    categoria: 'Bebidas',
    proveedor: 'Coca Cola',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 12,
    codigo: 'ART012',
    nombre: 'Jabón Dove',
    descripcion: 'Pack 4 barras',
    precioCompra: 35.00,
    precioVenta: 45.00,
    stock: 15,
    stockMinimo: 5,
    categoria: 'Higiene',
    proveedor: 'Unilever',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 13,
    codigo: 'ART013',
    nombre: 'Pasta Dental',
    descripcion: 'Colgate 180g',
    precioCompra: 24.00,
    precioVenta: 30.00,
    stock: 35,
    stockMinimo: 10,
    categoria: 'Higiene',
    proveedor: 'Colgate',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 14,
    codigo: 'ART014',
    nombre: 'Camisa Polo',
    descripcion: 'Algodón M',
    precioCompra: 300.00,
    precioVenta: 400.00,
    stock: 12,
    stockMinimo: 3,
    categoria: 'Ropa',
    proveedor: 'H&M',
    fechaCreacion: '2026-03-23T12:00:00Z'
  },
  {
    id: 15,
    codigo: 'ART015',
    nombre: "Jeans Levi's",
    descripcion: 'Slim 32x32',
    precioCompra: 900.00,
    precioVenta: 1200.00,
    stock: 6,
    stockMinimo: 2,
    categoria: 'Ropa',
    proveedor: "Levi's",
    fechaCreacion: '2026-03-23T12:00:00Z'
  }
];


// Función util para filtrar bajos en stock
export const getProductosBajoStock = (productos: Producto[]): Producto[] => {
  return productos.filter(p => p.stock <= p.stockMinimo);
};

