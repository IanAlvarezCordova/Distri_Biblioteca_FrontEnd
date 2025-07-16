// src/pages/Categorias.tsx
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
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
            console.log('Cargando categorías...');
            const categoriasData = await categoriaService.findAll();
            console.log('Categorías cargadas:', categoriasData);
            setCategorias(categoriasData);
            console.log('Estado de categorías actualizado');
        } catch (error) {
            console.error('Error al cargar categorías:', error);
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
                // Actualizar el estado local inmediatamente
                setCategorias(prevCategorias => 
                    prevCategorias.map(categoria => 
                        categoria.id === newCategoria.id ? { ...categoria, nombre: newCategoria.nombre } : categoria
                    )
                );
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizada', life: 3000 });
            } else {
                const createdCategoria = await categoriaService.create({ nombre: newCategoria.nombre });
                // Agregar la nueva categoría al estado local
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
        console.log('=== INICIO ELIMINACIÓN ===');
        console.log('ID a eliminar:', id);
        console.log('Categorías actuales:', categorias);
        
        confirmDialog({
            message: '¿Estás seguro de que quieres eliminar esta categoría?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    console.log('Usuario confirmó eliminación');
                    console.log('Llamando a categoriaService.delete con ID:', id);
                    
                    const result = await categoriaService.delete(id);
                    console.log('Respuesta del servicio delete:', result);
                    
                    console.log('Actualizando estado local...');
                    // Actualizar el estado local inmediatamente sin recargar
                    setCategorias(prevCategorias => {
                        console.log('Estado anterior:', prevCategorias);
                        const nuevasCategorias = prevCategorias.filter(categoria => {
                            const mantener = categoria.id !== id;
                            console.log(`Categoría ${categoria.id} (${categoria.nombre}): ${mantener ? 'mantener' : 'eliminar'}`);
                            return mantener;
                        });
                        console.log('Nuevo estado:', nuevasCategorias);
                        return nuevasCategorias;
                    });
                    
                    console.log('Estado actualizado, mostrando toast...');
                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'Éxito', 
                        detail: 'Categoría eliminada correctamente', 
                        life: 3000 
                    });
                    console.log('=== FIN ELIMINACIÓN EXITOSA ===');
                } catch (error) {
                    console.error('=== ERROR EN ELIMINACIÓN ===');
                    console.error('Error completo:', error);
                    toast.current?.show({ 
                        severity: 'error', 
                        summary: 'Error', 
                        detail: 'Error al eliminar categoría', 
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