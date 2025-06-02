// src/pages/Devoluciones.tsx
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { devolucionService } from '../services/devolucionService';
import { prestamoService } from '../services/prestamoService';
import { Card } from 'primereact/card';
import { libroService } from '../services/libroService';

interface Prestamo {
    id: number;
    libro: { id: number; titulo: string };
    usuario: { id: number; nombre: string; apellido: string };
    fecha_prestamo: string;
    fecha_devolucion: string | null;
    devuelto: boolean;
}

interface Devolucion {
    id: number;
    prestamo: { id: number };
    usuario: { id: number; nombre: string; apellido: string };
    libro: { id: number; titulo: string };
    fecha_devolucion: string;
}

const Devoluciones: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [devoluciones, setDevoluciones] = useState<Devolucion[]>([]);
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [newDevolucion, setNewDevolucion] = useState<{ prestamo: Prestamo | null }>({ prestamo: null });

    const fetchData = async () => {
        try {
            const [devolucionesData, prestamosData] = await Promise.all([
                devolucionService.findAll(),
                prestamoService.findAll(),
            ]) as [Devolucion[], Prestamo[]]; // Especificar tipos
            setDevoluciones(devolucionesData);
            setPrestamos(prestamosData.filter((p: Prestamo) => !p.devuelto));
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar devoluciones', life: 3000 });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateDevolucion = async () => {
        try {
            if (!newDevolucion.prestamo) {
                toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar un préstamo', life: 3000 });
                return;
            }
            const today = new Date(); // Usar objeto Date directamente
    
            await devolucionService.create({
                prestamoId: newDevolucion.prestamo.id, // Ajustar a prestamoId según el backend
            });
    
            await prestamoService.update(newDevolucion.prestamo.id, {
                fecha_devolucion: today,
                devuelto: true,
            });
    
            await libroService.update(newDevolucion.prestamo.libro.id, { disponible: true });
    
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Devolución registrada', life: 3000 });
            setShowDialog(false);
            setNewDevolucion({ prestamo: null });
            fetchData();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al registrar devolución', life: 3000 });
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <Toast ref={toast} />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Gestión de Devoluciones</h2>
                <Button
                    label="Registrar Devolución"
                    icon="pi pi-plus"
                    className="p-button-primary p-button-sm"
                    onClick={() => setShowDialog(true)}
                />
            </div>

            <Card className="shadow-md">
                <DataTable value={devoluciones}>
                    <Column field="libro.titulo" header="Libro" />
                    <Column
                        field="usuario"
                        header="Usuario"
                        body={(rowData) => `${rowData.usuario.nombre} ${rowData.usuario.apellido}`}
                    />
                    <Column field="fecha_devolucion" header="Fecha de Devolución" />
                </DataTable>
            </Card>

            <Dialog
                header="Registrar Devolución"
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                className="w-full md:w-1/2"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">Préstamo</label>
                        <Dropdown
                            value={newDevolucion.prestamo}
                            options={prestamos}
                            optionLabel="titulo"
                            itemTemplate={(option: Prestamo) => `${option.libro.titulo} - ${option.usuario.nombre} ${option.usuario.apellido}`}
                            onChange={(e) => setNewDevolucion({ prestamo: e.value })}
                            placeholder="Selecciona un préstamo"
                            className="w-full"
                        />
                    </div>
                    <Button
                        label="Registrar"
                        icon="pi pi-check"
                        className="p-button-success w-full"
                        onClick={handleCreateDevolucion}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default Devoluciones;