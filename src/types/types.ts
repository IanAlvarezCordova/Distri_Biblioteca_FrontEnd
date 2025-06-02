export interface RegistroServicio {
    id: number;
    fechaServicio: string;
    descripcion?: string;
    costo: number;
    tipoServicio: 'mantenimiento preventivo' | 'reparacion correctiva' | 'revision tecnica';
    kilometraje: number;
    documentos?: string;
    vehiculo: Vehiculo;
    taller: Taller;
    updatedAt: Date;
}

export interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    año: number;
    numeroPlaca: string;
    color: string;
    tipo: 'automovil' | 'camion' | 'motocicleta';
    odometro: number;
    estado: 'activo' | 'en mantenimiento' | 'inactivo';
    createdAt: Date;
    updatedAt: Date;
}

export interface Taller {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    correo: string;
    horariosAtencion?: string;
    especialidades?: string;
    createdAt: Date;
    updatedAt: Date;
}