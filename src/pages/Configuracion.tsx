import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { usuarioService, Usuario, Rol } from '../services/usuarioService';
import { Card } from 'primereact/card';

const Configuracion: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showRolesDialog, setShowRolesDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [editUsuario, setEditUsuario] = useState<Partial<Usuario>>({});
  const [selectedRoles, setSelectedRoles] = useState<Rol[]>([]);

  // Cargar usuarios y roles
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

  // Editar usuario
  const handleEditUsuario = async () => {
    if (!selectedUsuario) return;
    try {
      if (!editUsuario.nombre || !editUsuario.apellido || !editUsuario.email || !editUsuario.username) {
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
        username: editUsuario.username,
      });
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario actualizado exitosamente',
        life: 3000,
      });
      await fetchData();
      setShowEditDialog(false);
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

  // Gestionar roles
  const handleSaveRoles = async () => {
    if (!selectedUsuario) return;
    try {
      const currentRoles = selectedUsuario.roles || [];
      const rolesToAdd = selectedRoles.filter((rol) => !currentRoles.some((r) => r.id === rol.id));
      const rolesToRemove = currentRoles.filter((rol) => !selectedRoles.some((r) => r.id === rol.id));

      for (const rol of rolesToAdd) {
        await usuarioService.asignarRol(selectedUsuario.id, rol.id);
      }
      for (const rol of rolesToRemove) {
        await usuarioService.removerRol(selectedUsuario.id, rol.id);
      }

      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Roles actualizados',
        life: 3000,
      });
      await fetchData();
      setShowRolesDialog(false);
      setSelectedUsuario(null);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar los roles',
        life: 3000,
      });
    }
  };

  // Eliminar usuario
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

  // Columnas de la tabla
  const rolesBodyTemplate = (rowData: Usuario) => rowData.roles.map((rol: Rol) => rol.nombre).join(', ');
  const ultimoAccesoBodyTemplate = (rowData: Usuario) => {
    if (!rowData.ultimo_acceso) return <span className="text-gray-400">Nunca</span>;
    const fecha = new Date(rowData.ultimo_acceso);
    return <span className="text-gray-700">{fecha.toLocaleString('es-ES')}</span>;
  };

  const actionBodyTemplate = (rowData: Usuario) => (
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
            username: rowData.username,
          });
          setShowEditDialog(true);
        }}
        data-pr-tooltip="Editar usuario"
      />
      <Button
        icon="pi pi-users"
        className="p-button-info p-button-sm"
        onClick={() => {
          setSelectedUsuario(rowData);
          setSelectedRoles(rowData.roles);
          setShowRolesDialog(true);
        }}
        data-pr-tooltip="Gestionar roles"
      />
      <Button
        icon="pi pi-trash"
        className="p-button-danger p-button-sm"
        onClick={() => {
          setUsuarioToDelete(rowData);
          setShowDeleteDialog(true);
        }}
        data-pr-tooltip="Eliminar usuario"
      />
      <Tooltip target=".p-button-sm" />
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6 mt-16">
      <Toast ref={toast} />
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gestión de Usuarios</h2>

      <Card className="shadow-md">
        <DataTable value={usuarios} responsiveLayout="scroll">
          <Column field="nombre" header="Nombre" sortable filter />
          <Column field="apellido" header="Apellido" sortable filter />
          <Column field="email" header="Email" sortable filter />
          <Column field="username" header="Username" sortable filter />
          <Column field="roles" header="Roles" body={rolesBodyTemplate} />
          <Column field="ultimo_acceso" header="Último Acceso" body={ultimoAccesoBodyTemplate} />
          <Column body={actionBodyTemplate} header="Acciones" />
        </DataTable>
      </Card>

      {/* Editar usuario */}
      <Dialog
        header="Editar Usuario"
        visible={showEditDialog}
        onHide={() => {
          setShowEditDialog(false);
          setSelectedUsuario(null);
        }}
        style={{ width: '30rem' }} // Tamaño fijo para el diálogo
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setShowEditDialog(false)}
            />
            <Button
              label="Actualizar"
              icon="pi pi-check"
              className="p-button-success"
              onClick={handleEditUsuario}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Nombre</label>
            <InputText
              value={editUsuario.nombre || ''}
              onChange={(e) => setEditUsuario({ ...editUsuario, nombre: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Apellido</label>
            <InputText
              value={editUsuario.apellido || ''}
              onChange={(e) => setEditUsuario({ ...editUsuario, apellido: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Email</label>
            <InputText
              value={editUsuario.email || ''}
              onChange={(e) => setEditUsuario({ ...editUsuario, email: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Username</label>
            <InputText
              value={editUsuario.username || ''}
              onChange={(e) => setEditUsuario({ ...editUsuario, username: e.target.value })}
              className="w-full"
            />
          </div>
        </div>
      </Dialog>

      {/* Gestionar roles */}
      <Dialog
        header="Gestionar Roles"
        visible={showRolesDialog}
        onHide={() => setShowRolesDialog(false)}
        style={{ width: '30rem' }} // Tamaño fijo para el diálogo
        footer={
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={() => setShowRolesDialog(false)}
            />
            <Button
              label="Guardar"
              icon="pi pi-save"
              className="p-button-success"
              onClick={handleSaveRoles}
            />
          </div>
        }
      >
        <div className="space-y-4">
          <label className="block mb-1 font-semibold text-gray-700">Roles</label>
          <MultiSelect
            value={selectedRoles}
            options={roles}
            optionLabel="nombre"
            onChange={(e) => setSelectedRoles(e.value)}
            className="w-full"
            display="chip"
            placeholder="Seleccione roles"
          />
        </div>
      </Dialog>

      {/* Confirmar eliminación */}
      <Dialog
        header="Confirmar Eliminación"
        visible={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        style={{ width: '25rem' }} // Tamaño más pequeño para el diálogo de eliminación
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