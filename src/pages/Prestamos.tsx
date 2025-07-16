import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { prestamoService } from '../services/prestamoService';
import { libroService } from '../services/libroService';
import { usuarioService } from '../services/usuarioService';
import { Card } from 'primereact/card';
import { useAuth } from '../context/AuthContext';

interface Prestamo {
    id: number;
    libro: { id: number; titulo: string };
    usuario: { id: number; nombre: string; apellido: string };
    fecha_prestamo: string;
    fecha_devolucion: string | null;
    devuelto: boolean;
}

interface Libro {
    id: number;
    titulo: string;
    disponible: boolean;
}

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
}

const Prestamos: React.FC = () => {
    const toast = useRef<Toast>(null);
    const { user, roles } = useAuth();
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    const [libros, setLibros] = useState<Libro[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [newPrestamo, setNewPrestamo] = useState<{ libro: Libro | null; usuarioId?: number }>({
        libro: null,
    });

    const isAdmin = roles?.some((rol: any) => rol.nombre === 'administrador');

    const fetchData = async () => {
        try {
            const [prestamosData, librosData, usuariosData] = await Promise.all([
                prestamoService.findAll(),
                libroService.findAll(),
                usuarioService.findAll(),
            ]) as [Prestamo[], Libro[], Usuario[]];
            setPrestamos(prestamosData);
            setLibros(librosData.filter((l: Libro) => l.disponible));
            setUsuarios(usuariosData.map(u => ({
                ...u,
                fullName: `${u.nombre} ${u.apellido}`
            })));
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar datos', life: 3000 });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreatePrestamo = async () => {
        if (!newPrestamo.libro) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un libro', life: 3000 });
            return;
        }
        if (isAdmin && !newPrestamo.usuarioId) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un usuario', life: 3000 });
            return;
        }

        try {
            const today = new Date();
            const usuarioId = isAdmin ? newPrestamo.usuarioId : user?.id;
            if (!usuarioId) {
                toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'No se pudo determinar el usuario.', life: 3000 });
                return;
            }

            await prestamoService.create({
                libro: { id: newPrestamo.libro.id },
                fecha_prestamo: today,
                devuelto: false,
                usuarioId, // <-- fuera del objeto libro
            });
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Préstamo registrado', life: 3000 });
            setShowDialog(false);
            setNewPrestamo({ libro: null });
            fetchData();
        } catch (error: any) {
            const message = error.message.toLowerCase().includes('forbidden resource')
                ? 'No tienes permisos para realizar esta acción.'
                : error.message;
            toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        }
    };

    const dialogFooter = (
        <div className="flex justify-end gap-2">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => setShowDialog(false)}
            />
            <Button
                label="Registrar"
                icon="pi pi-check"
                className="p-button-success"
                onClick={handleCreatePrestamo}
            />
        </div>
    );

    return (
        <div className="p-4 md:p-6 space-y-6">
            <Toast ref={toast} />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Gestión de Préstamos</h2>
                <Button
                    label="Registrar Préstamo"
                    icon="pi pi-plus"
                    className="p-button-primary p-button-sm"
                    onClick={() => setShowDialog(true)}
                />
            </div>

            <Card className="shadow-md">
                <DataTable value={prestamos} responsiveLayout="scroll">
                    <Column field="libro.titulo" header="Libro" />
                    <Column
                        field="usuario"
                        header="Usuario"
                        body={(rowData: Prestamo) => `${rowData.usuario.nombre} ${rowData.usuario.apellido}`}
                    />
                    <Column field="fecha_prestamo" header="Fecha de Préstamo" />
                    <Column field="fecha_devolucion" header="Fecha de Devolución" />
                    <Column
                        field="devuelto"
                        header="Devuelto"
                        body={(rowData: Prestamo) => (rowData.devuelto ? 'Sí' : 'No')}
                    />
                </DataTable>
            </Card>

            <Dialog
                header="Registrar Préstamo"
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                style={{ width: 'clamp(20rem, 90vw, 30rem)' }}
                footer={dialogFooter}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">Libro</label>
                        <Dropdown
                            value={newPrestamo.libro}
                            options={libros}
                            optionLabel="titulo"
                            onChange={(e) => setNewPrestamo({ ...newPrestamo, libro: e.value })}
                            placeholder="Selecciona un libro"
                            className="w-full"
                        />
                    </div>
                    {isAdmin && (
                        <div>
                            <label className="block mb-1 font-semibold">Usuario</label>
                            <Dropdown
                                value={newPrestamo.usuarioId ?? null}
                                options={usuarios}
                                optionLabel="fullName"
                                optionValue="id"
                                onChange={(e) => setNewPrestamo({ ...newPrestamo, usuarioId: e.value })}
                                placeholder="Selecciona un usuario"
                                className="w-full"
                            />
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
};

export default Prestamos;