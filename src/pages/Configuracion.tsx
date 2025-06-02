// src/pages/Configuracion.tsx
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { usuarioService, Usuario, Rol } from '../services/usuarioService';
import { Card } from 'primereact/card';

const Configuracion: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [editUsuario, setEditUsuario] = useState<Partial<Usuario>>({
    nombre: '',
    apellido: '',
    email: '',
    roles: [],
  });

  const fetchData = async () => {
    try {
      const [usuariosData, rolesData] = await Promise.all([
        usuarioService.findAll(),
        usuarioService.getRoles(),
      ]);
      setUsuarios(usuariosData);
      setRoles(rolesData);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar usuarios',
        life: 3000,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditUsuario = async () => {
    if (!selectedUsuario) return;
    try {
      if (!editUsuario.nombre || !editUsuario.apellido || !editUsuario.email) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Todos los campos son obligatorios',
          life: 3000,
        });
        return;
      }
      await usuarioService.update(selectedUsuario.id, {
        nombre: editUsuario.nombre,
        apellido: editUsuario.apellido,
        email: editUsuario.email,
      });

      const currentRoles = selectedUsuario.roles.map((rol) => rol.id);
      const newRoles = editUsuario.roles?.map((rol) => rol.id) || [];

      const rolesToRemove = currentRoles.filter((rolId) => !newRoles.includes(rolId));
      for (const rolId of rolesToRemove) {
        await usuarioService.removerRol(selectedUsuario.id, rolId);
      }

      const rolesToAdd = newRoles.filter((rolId) => !currentRoles.includes(rolId));
      for (const rolId of rolesToAdd) {
        await usuarioService.asignarRol(selectedUsuario.id, rolId);
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario actualizado exitosamente',
        life: 3000,
      });
      await fetchData();
      setShowDialog(false);
      setSelectedUsuario(null);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al editar usuario',
        life: 3000,
      });
    }
  };

  const handleDeleteUsuario = async () => {
    if (!usuarioToDelete) return;
    try {
      await usuarioService.delete(usuarioToDelete.id);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario eliminado exitosamente',
        life: 3000,
      });
      await fetchData();
      setShowDeleteDialog(false);
      setUsuarioToDelete(null);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al eliminar usuario',
        life: 3000,
      });
    }
  };

  const actionBodyTemplate = (rowData: Usuario) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-success p-button-sm"
          onClick={() => {
            setSelectedUsuario(rowData);
            setEditUsuario({
              nombre: rowData.nombre,
              apellido: rowData.apellido,
              email: rowData.email,
              roles: rowData.roles,
            });
            setShowDialog(true);
          }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-sm"
          onClick={() => {
            setUsuarioToDelete(rowData);
            setShowDeleteDialog(true);
          }}
        />
      </div>
    );
  };

  const rolesBodyTemplate = (rowData: Usuario) => {
    return rowData.roles.map((rol: Rol) => rol.nombre).join(', ');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 mt-16">
      <Toast ref={toast} />
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Gestión de Usuarios
      </h2>

      <Card className="shadow-md">
        <DataTable value={usuarios} responsiveLayout="scroll">
          <Column field="nombre" header="Nombre" />
          <Column field="apellido" header="Apellido" />
          <Column field="email" header="Email" />
          <Column field="roles" header="Roles" body={rolesBodyTemplate} />
          <Column body={actionBodyTemplate} header="Acciones" />
        </DataTable>
      </Card>

      <Dialog
        header="Editar Usuario"
        visible={showDialog}
        onHide={() => {
          setShowDialog(false);
          setSelectedUsuario(null);
        }}
        className="w-full md:w-1/2"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Nombre
            </label>
            <InputText
              value={editUsuario.nombre || ''}
              onChange={(e) =>
                setEditUsuario({ ...editUsuario, nombre: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Apellido
            </label>
            <InputText
              value={editUsuario.apellido || ''}
              onChange={(e) =>
                setEditUsuario({ ...editUsuario, apellido: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Email
            </label>
            <InputText
              value={editUsuario.email || ''}
              onChange={(e) =>
                setEditUsuario({ ...editUsuario, email: e.target.value })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Roles
            </label>
            <MultiSelect
              value={editUsuario.roles}
              options={roles}
              optionLabel="nombre"
              onChange={(e) => setEditUsuario({ ...editUsuario, roles: e.value })}
              className="w-full"
            />
          </div>
          <Button
            label="Actualizar"
            icon="pi pi-check"
            className="p-button-success w-full"
            onClick={handleEditUsuario}
          />
        </div>
      </Dialog>

      <Dialog
        header="Confirmar Eliminación"
        visible={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        className="w-full md:w-1/3"
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setShowDeleteDialog(false)}
            />
            <Button
              label="Eliminar"
              icon="pi pi-trash"
              className="p-button-danger"
              onClick={handleDeleteUsuario}
            />
          </div>
        }
      >
        <p>
          ¿Está seguro de que desea eliminar al usuario "
          {usuarioToDelete?.nombre} {usuarioToDelete?.apellido}"?
        </p>
      </Dialog>
    </div>
  );
};

export default Configuracion;