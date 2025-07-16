import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { devolucionService } from '../services/devolucionService';
import { prestamoService } from '../services/prestamoService';
import { libroService } from '../services/libroService';
import { Card } from 'primereact/card';

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
            ]) as [Devolucion[], Prestamo[]];
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
            const today = new Date();
            await devolucionService.create({
                prestamoId: newDevolucion.prestamo.id,
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
                onClick={handleCreateDevolucion}
            />
        </div>
    );

    return (
        <div className="p-4 md:p-6 space-y-6 mt-16">
            <Toast ref={toast} />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Gestión de Devoluciones</h2>
                <Button
                    label="Registrar Devolución"
                    icon="pi pi-plus"
                    className="p-button-primary p-button-sm"
                    onClick={() => setShowDialog(true)}
                    data-pr-tooltip="Registrar nueva devolución"
                />
                <Tooltip target=".p-button-sm" />
            </div>

            <Card className="shadow-md">
                <DataTable value={devoluciones} responsiveLayout="scroll">
                    <Column field="libro.titulo" header="Libro" sortable filter filterMatchMode="contains" />
                    <Column
                        field="usuario"
                        header="Usuario"
                        body={(rowData) => `${rowData.usuario.nombre} ${rowData.usuario.apellido}`}
                        sortable
                        filter
                        filterMatchMode="contains"
                    />
                    <Column field="fecha_devolucion" header="Fecha de Devolución" sortable />
                </DataTable>
            </Card>

            <Dialog
                header="Registrar Devolución"
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                style={{ width: 'clamp(20rem, 90vw, 30rem)' }}
                footer={dialogFooter}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold text-gray-700">Préstamo</label>
                        <Dropdown
                            value={newDevolucion.prestamo}
                            options={prestamos}
                            onChange={(e) => setNewDevolucion({ prestamo: e.value })}
                            placeholder="Selecciona un préstamo"
                            className="w-full"
                            itemTemplate={(option: Prestamo) =>
                                option ? `${option.libro.titulo} - ${option.usuario.nombre} ${option.usuario.apellido}` : ''
                            }
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Devoluciones;