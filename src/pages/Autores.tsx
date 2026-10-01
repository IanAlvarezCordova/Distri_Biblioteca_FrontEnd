import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tooltip } from 'primereact/tooltip';
import { autorService } from '../services/autorService';
import { Card } from 'primereact/card';

interface Autor {
    id: number;
    nombre: string;
}

const Autores: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [autores, setAutores] = useState<Autor[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newAutor, setNewAutor] = useState({ id: 0, nombre: '' });

    const fetchData = async () => {
        try {
            const autoresData = await autorService.findAll();
            setAutores(autoresData);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar autores', life: 3000 });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOrUpdate = async () => {
        if (!newAutor.nombre) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'El nombre es obligatorio', life: 3000 });
            return;
        }

        try {
            if (editMode) {
                await autorService.update(newAutor.id, { nombre: newAutor.nombre });
                setAutores(prevAutores => 
                    prevAutores.map(autor => 
                        autor.id === newAutor.id ? { ...autor, nombre: newAutor.nombre } : autor
                    )
                );
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Autor actualizado', life: 3000 });
            } else {
                const createdAutor = await autorService.create({ nombre: newAutor.nombre });
                setAutores(prevAutores => [...prevAutores, createdAutor]);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Autor creado', life: 3000 });
            }
            setShowDialog(false);
            setNewAutor({ id: 0, nombre: '' });
        } catch (error: any) {
            console.error('Error al guardar autor:', error);
            const message = error.message.toLowerCase().includes('forbidden resource')
                ? 'No tienes permisos para realizar esta acción.'
                : error.message;
            toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        }
    };

    const handleEdit = (autor: Autor) => {
        setEditMode(true);
        setNewAutor(autor);
        setShowDialog(true);
    };

    const handleDelete = async (id: number) => {
        confirmDialog({
            message: '¿Estás seguro de que quieres eliminar este autor?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await autorService.delete(id);
                    setAutores(prevAutores => prevAutores.filter(autor => autor.id !== id));
                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'Éxito', 
                        detail: 'Autor eliminado correctamente', 
                        life: 3000 
                    });
                } catch (error) {
                    toast.current?.show({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: 'Error al eliminar autor', 
                        life: 3000 
                    });
                }
            }
        });
    };

    const actionBodyTemplate = (rowData: Autor) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-success p-button-sm"
                onClick={() => handleEdit(rowData)}
                data-pr-tooltip="Editar autor"
            />
            <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-sm"
                onClick={() => handleDelete(rowData.id)}
                data-pr-tooltip="Eliminar autor"
            />
            <Tooltip target=".p-button-sm" />
        </div>
    );

    const dialogFooter = (
        <div className="flex justify-end gap-2">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => setShowDialog(false)}
            />
            <Button
                label={editMode ? 'Actualizar' : 'Guardar'}
                icon="pi pi-check"
                className="p-button-success"
                onClick={handleCreateOrUpdate}
            />
        </div>
    );

    return (
        <div className="app-page space-y-6 animate-app-in">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Gestión de Autores</h2>
                <Button
                    label="Agregar Autor"
                    icon="pi pi-plus"
                    className="p-button-primary p-button-sm"
                    onClick={() => {
                        setEditMode(false);
                        setNewAutor({ id: 0, nombre: '' });
                        setShowDialog(true);
                    }}
                    data-pr-tooltip="Crear nuevo autor"
                />
                <Tooltip target=".p-button-sm" />
            </div>

            <Card className="shadow-none">
                <DataTable value={autores} responsiveLayout="scroll">
                    <Column field="nombre" header="Nombre" sortable filter filterMatchMode="contains" />
                    <Column header="Acciones" body={actionBodyTemplate} />
                </DataTable>
            </Card>

            <Dialog
                header={editMode ? 'Editar Autor' : 'Agregar Autor'}
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                style={{ width: '30rem' }}
                footer={dialogFooter}
            >
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Nombre</label>
                        <InputText
                            value={newAutor.nombre}
                            onChange={(e) => setNewAutor({ ...newAutor, nombre: e.target.value })}
                            className="w-full"
                            placeholder="Nombre del autor"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Autores;