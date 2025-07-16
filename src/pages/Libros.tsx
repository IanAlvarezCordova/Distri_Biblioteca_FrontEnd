import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tooltip } from 'primereact/tooltip';
import { libroService } from '../services/libroService';
import { autorService } from '../services/autorService';
import { categoriaService } from '../services/categoriaService';
import { Card } from 'primereact/card';

interface Autor {
    id: number;
    nombre: string;
}

interface Categoria {
    id: number;
    nombre: string;
}

interface Libro {
    id: number;
    titulo: string;
    autor: Autor;
    categoria: Categoria;
    disponible: boolean;
}

interface LibroFormData {
    titulo: string;
    autor: Autor | null;
    categoria: Categoria | null;
    disponible: boolean;
    id?: number;
}

const Libros: React.FC = () => {
    const toast = useRef<Toast>(null);
    const [libros, setLibros] = useState<Libro[]>([]);
    const [autores, setAutores] = useState<Autor[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newLibro, setNewLibro] = useState<LibroFormData>({
        titulo: '',
        autor: null,
        categoria: null,
        disponible: true,
    });

    const fetchData = async () => {
        try {
            const [librosData, autoresData, categoriasData] = await Promise.all([
                libroService.findAll(),
                autorService.findAll(),
                categoriaService.findAll(),
            ]);
            setLibros(librosData);
            setAutores(autoresData);
            setCategorias(categoriasData);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar datos', life: 3000 });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOrUpdate = async () => {
        if (!newLibro.titulo || !newLibro.autor || !newLibro.categoria) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Todos los campos son obligatorios',
                life: 3000,
            });
            return;
        }

        const libroData = {
            titulo: newLibro.titulo,
            autor: {
                id: newLibro.autor.id,
                nombre: newLibro.autor.nombre,
            },
            categoria: {
                id: newLibro.categoria.id,
                nombre: newLibro.categoria.nombre,
            },
            disponible: newLibro.disponible,
        };

        try {
            if (editMode && newLibro.id !== undefined) {
                const updatedLibro = await libroService.update(newLibro.id, libroData);
                setLibros(prevLibros => 
                    prevLibros.map(libro => 
                        libro.id === newLibro.id ? {...updatedLibro, ...libroData, id: newLibro.id} : libro
                    )
                );
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Libro actualizado', life: 3000 });
            } else {
                const createdLibro = await libroService.create(libroData);
                setLibros(prevLibros => [...prevLibros, createdLibro]);
                toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Libro creado', life: 3000 });
            }

            setShowDialog(false);
            setNewLibro({ titulo: '', autor: null, categoria: null, disponible: true });
        } catch (error: any) {
            const message = error.message.toLowerCase().includes('forbidden resource')
                ? 'No tienes permisos para realizar esta acción.'
                : error.message;
            toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        }
    };

    const handleEdit = (libro: Libro) => {
        setEditMode(true);
        setNewLibro({
            id: libro.id,
            titulo: libro.titulo,
            autor: libro.autor,
            categoria: libro.categoria,
            disponible: libro.disponible,
        });
        setShowDialog(true);
    };

    const handleDelete = async (id: number) => {
        confirmDialog({
            message: '¿Estás seguro de que quieres eliminar este libro?',
            header: 'Confirmar Eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: async () => {
                try {
                    await libroService.delete(id);
                    setLibros(prevLibros => prevLibros.filter(libro => libro.id !== id));
                    toast.current?.show({ 
                        severity: 'success', 
                        summary: 'Éxito', 
                        detail: 'Libro eliminado correctamente', 
                        life: 3000 
                    });
                } catch (error: any) {
                    
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

    const actionBodyTemplate = (rowData: Libro) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-success p-button-sm"
                onClick={() => handleEdit(rowData)}
                data-pr-tooltip="Editar libro"
            />
            <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-sm"
                onClick={() => handleDelete(rowData.id)}
                data-pr-tooltip="Eliminar libro"
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
        <div className="p-4 md:p-6 space-y-6 mt-16">
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Gestión de Libros</h2>
                <Button
                    label="Agregar Libro"
                    icon="pi pi-plus"
                    className="p-button-primary p-button-sm"
                    onClick={() => {
                        setEditMode(false);
                        setNewLibro({ titulo: '', autor: null, categoria: null, disponible: true });
                        setShowDialog(true);
                    }}
                    data-pr-tooltip="Crear nuevo libro"
                />
                <Tooltip target=".p-button-sm" />
            </div>

            <Card className="shadow-md">
                <DataTable value={libros} responsiveLayout="scroll">
                    <Column field="titulo" header="Título" sortable filter filterMatchMode="contains" />
                    <Column field="autor.nombre" header="Autor" sortable filter filterMatchMode="contains" />
                    <Column field="categoria.nombre" header="Categoría" sortable filter filterMatchMode="contains" />
                    <Column
                        field="disponible"
                        header="Disponible"
                        body={(rowData: Libro) => (rowData.disponible ? 'Sí' : 'No')}
                        sortable
                    />
                    <Column header="Acciones" body={actionBodyTemplate} />
                </DataTable>
            </Card>

            <Dialog
                header={editMode ? 'Editar Libro' : 'Agregar Libro'}
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                style={{ width: '30rem' }}
                footer={dialogFooter}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold text-gray-700">Título</label>
                        <InputText
                            value={newLibro.titulo}
                            onChange={(e) => setNewLibro({ ...newLibro, titulo: e.target.value })}
                            className="w-full"
                            placeholder="Título del libro"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-gray-700">Autor</label>
                        <Dropdown
                            value={newLibro.autor}
                            options={autores}
                            optionLabel="nombre"
                            onChange={(e) => setNewLibro({ ...newLibro, autor: e.value })}
                            placeholder="Selecciona un autor"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-gray-700">Categoría</label>
                        <Dropdown
                            value={newLibro.categoria}
                            options={categorias}
                            optionLabel="nombre"
                            onChange={(e) => setNewLibro({ ...newLibro, categoria: e.value })}
                            placeholder="Selecciona una categoría"
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Libros;