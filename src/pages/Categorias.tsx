import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tooltip } from 'primereact/tooltip';
import { categoriaService } from '../services/categoriaService';
import { Card } from 'primereact/card';

interface Categoria {
    id: number;
    nombre: string;
}

const Categorias: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newCategoria, setNewCategoria] = useState({ id: 0, nombre: '' });

    const fetchData = async () => {
        try {
            const categoriasData = await categoriaService.findAll();
            setCategorias(categoriasData);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar categorías', life: 3000 });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOrUpdate = async () => {
        if (!newCategoria.nombre) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'El nombre es obligatorio', life: 3000 });
            return;
        }

        try {
            if (editMode) {
                await categoriaService.update(newCategoria.id, { nombre: newCategoria.nombre });
                setCategorias(prevCategorias => 
                    prevCategorias.map(categoria => 
                        categoria.id === newCategoria.id ? { ...categoria, nombre: newCategoria.nombre } : categoria
                    )
                );
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada', life: 3000 });
            } else {
                const createdCategoria = await categoriaService.create({ nombre: newCategoria.nombre });
                setCategorias(prevCategorias => [...prevCategorias, createdCategoria]);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría creada', life: 3000 });
            }
            setShowDialog(false);
            setNewCategoria({ id: 0, nombre: '' });
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar categoría', life: 3000 });
        }
    };

    const handleEdit = (categoria: Categoria) => {
        setEditMode(true);
        setNewCategoria(categoria);
        setShowDialog(true);
    };

    const handleDelete = async (id: number) => {
        confirmDialog({
            message: '¿Estás seguro de que quieres eliminar esta categoría?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await categoriaService.delete(id);
                    setCategorias(prevCategorias => prevCategorias.filter(categoria => categoria.id !== id));
                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'Éxito', 
                        detail: 'Categoría eliminada correctamente', 
                        life: 3000 
                    });
                } catch (error: any) {
                    console.error('Error al eliminar categoría:', error);
                    const message = error.message.toLowerCase().includes('forbidden resource')
                        ? 'No tienes permisos para realizar esta acción.'
                        : error.message;
                    toast.current?.show({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: message, 
                        life: 3000 
                    });
                }
            }
        });
    };

    const actionBodyTemplate = (rowData: Categoria) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-success p-button-sm"
                onClick={() => handleEdit(rowData)}
                data-pr-tooltip="Editar categoría"
            />
            <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-sm"
                onClick={() => handleDelete(rowData.id)}
                data-pr-tooltip="Eliminar categoría"
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
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Gestión de Categorías</h2>
                <Button
                    label="Agregar Categoría"
                    icon="pi pi-plus"
                    className="p-button-primary p-button-sm"
                    onClick={() => {
                        setEditMode(false);
                        setNewCategoria({ id: 0, nombre: '' });
                        setShowDialog(true);
                    }}
                    data-pr-tooltip="Crear nueva categoría"
                />
                <Tooltip target=".p-button-sm" />
            </div>

            <Card className="shadow-none">
                <DataTable value={categorias} responsiveLayout="scroll">
                    <Column field="nombre" header="Nombre" sortable filter filterMatchMode="contains" />
                    <Column header="Acciones" body={actionBodyTemplate} />
                </DataTable>
            </Card>

            <Dialog
                header={editMode ? 'Editar Categoría' : 'Agregar Categoría'}
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                style={{ width: '30rem' }}
                footer={dialogFooter}
            >
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Nombre</label>
                        <InputText
                            value={newCategoria.nombre}
                            onChange={(e) => setNewCategoria({ ...newCategoria, nombre: e.target.value })}
                            className="w-full"
                            placeholder="Nombre de la categoría"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Categorias;