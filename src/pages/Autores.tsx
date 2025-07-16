// src/pages/Autores.tsx
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
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
                // Actualizar el estado local inmediatamente
                setAutores(prevAutores => 
                    prevAutores.map(autor => 
                        autor.id === newAutor.id ? { ...autor, nombre: newAutor.nombre } : autor
                    )
                );
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Autor actualizado', life: 3000 });
            } else {
                const createdAutor = await autorService.create({ nombre: newAutor.nombre });
                // Agregar el nuevo autor al estado local
                setAutores(prevAutores => [...prevAutores, createdAutor]);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Autor creado', life: 3000 });
            }
            setShowDialog(false);
            setNewAutor({ id: 0, nombre: '' });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar autor', life: 3000 });
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
                    console.log('Eliminando autor con ID:', id);
                    await autorService.delete(id);
                    
                    // Actualizar el estado local inmediatamente sin recargar
                    setAutores(prevAutores => {
                        const nuevosAutores = prevAutores.filter(autor => autor.id !== id);
                        console.log('Autores antes:', prevAutores.length, 'Autores después:', nuevosAutores.length);
                        return nuevosAutores;
                    });
                    
                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'Éxito', 
                        detail: 'Autor eliminado correctamente', 
                        life: 3000 
                    });
                } catch (error) {
                    console.error('Error al eliminar autor:', error);
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

    return (
        <div className="p-4 md:p-6 space-y-6">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Gestión de Autores</h2>
                <Button
                    label="Agregar Autor"
                    icon="pi pi-plus"
                    className="p-button-primary p-button-sm"
                    onClick={() => {
                        setEditMode(false);
                        setNewAutor({ id: 0, nombre: '' });
                        setShowDialog(true);
                    }}
                />
            </div>

            <Card className="shadow-md">
                <DataTable value={autores} responsiveLayout="scroll">
                    <Column field="nombre" header="Nombre" />
                    <Column
                        header="Acciones"
                        body={(rowData) => (
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-pencil"
                                    className="p-button-warning p-button-sm"
                                    onClick={() => handleEdit(rowData)}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    className="p-button-danger p-button-sm"
                                    onClick={() => handleDelete(rowData.id)}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </Card>

            <Dialog
                header={editMode ? 'Editar Autor' : 'Agregar Autor'}
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                className="w-full md:w-1/2"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">Nombre</label>
                        <InputText
                            value={newAutor.nombre}
                            onChange={(e) => setNewAutor({ ...newAutor, nombre: e.target.value })}
                            className="w-full"
                            placeholder="Nombre del autor"
                        />
                    </div>
                    <Button
                        label={editMode ? 'Actualizar' : 'Guardar'}
                        icon="pi pi-check"
                        className="p-button-success w-full"
                        onClick={handleCreateOrUpdate}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default Autores;