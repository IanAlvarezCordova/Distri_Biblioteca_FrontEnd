// src/pages/Categorias.tsx
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
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
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada', life: 3000 });
            } else {
                await categoriaService.create({ nombre: newCategoria.nombre });
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría creada', life: 3000 });
            }
            setShowDialog(false);
            setNewCategoria({ id: 0, nombre: '' });
            fetchData();
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
        try {
            await categoriaService.delete(id);
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría eliminada', life: 3000 });
            fetchData();
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar categoría', life: 3000 });
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <Toast ref={toast} />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Gestión de Categorías</h2>
                <Button
                    label="Agregar Categoría"
                    icon="pi pi-plus"
                    className="p-button-primary p-button-sm"
                    onClick={() => {
                        setEditMode(false);
                        setNewCategoria({ id: 0, nombre: '' });
                        setShowDialog(true);
                    }}
                />
            </div>

            <Card className="shadow-md">
                <DataTable value={categorias} responsiveLayout="scroll">
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
                header={editMode ? 'Editar Categoría' : 'Agregar Categoría'}
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                className="w-full md:w-1/2"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">Nombre</label>
                        <InputText
                            value={newCategoria.nombre}
                            onChange={(e) => setNewCategoria({ ...newCategoria, nombre: e.target.value })}
                            className="w-full"
                            placeholder="Nombre de la categoría"
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

export default Categorias;