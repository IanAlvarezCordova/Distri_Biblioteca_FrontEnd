import React, { useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Usuario, usuarioService } from '../services/usuarioService';
import { useAuth } from '../context/AuthContext';

const Perfil: React.FC = () => {
  const toast = useRef<Toast>(null);
  const { user } = useAuth();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Usuario no autenticado', life: 3000 });
        return;
      }

      try {
        setUsuario(await usuarioService.findById(user.id));
      } catch {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar datos del usuario', life: 3000 });
      }
    };

    fetchUser();
  }, [user]);

  const handleUpdate = async () => {
    if (!usuario?.nombre || !usuario?.apellido || !usuario?.email) {
      toast.current?.show({ severity: 'warn', summary: 'Campos incompletos', detail: 'Todos los campos son obligatorios', life: 3000 });
      return;
    }

    try {
      await usuarioService.update(usuario.id, {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
      });
      toast.current?.show({ severity: 'success', summary: 'Perfil actualizado', detail: 'Tus cambios se guardaron correctamente', life: 3000 });
    } catch (error: any) {
      const message = error.message.toLowerCase().includes('forbidden resource')
        ? 'No tienes permisos para realizar esta acción.'
        : error.message;
      toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.current?.show({ severity: 'warn', summary: 'Campos incompletos', detail: 'Completa todos los campos', life: 3000 });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.current?.show({ severity: 'warn', summary: 'Verifica las contraseñas', detail: 'Las contraseñas no coinciden', life: 3000 });
      return;
    }

    setLoadingPassword(true);
    try {
      await usuarioService.update(usuario!.id, {
        password: newPassword,
        currentPassword,
      });
      toast.current?.show({ severity: 'success', summary: 'Contraseña actualizada', detail: 'La nueva contraseña ya está activa', life: 3000 });
      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const message =
        error.message.includes('contraseña actual') ? 'La contraseña actual es incorrecta' :
        error.message.includes('No encontrado') ? 'Usuario no encontrado' :
        'Error al cambiar contraseña';
      toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    } finally {
      setLoadingPassword(false);
    }
  };

  if (!usuario) {
    return (
      <div className="app-page flex min-h-[65vh] items-center justify-center">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <i className="pi pi-spin pi-spinner text-xl" />
          </span>
          <p className="mt-4 text-sm font-bold text-slate-700">Cargando tu perfil</p>
        </div>
      </div>
    );
  }

  const initials = `${usuario.nombre?.[0] || ''}${usuario.apellido?.[0] || ''}`.toUpperCase();

  return (
    <div className="app-page animate-app-in">
      <Toast ref={toast} />

      <div className="mb-7">
        <p className="app-eyebrow">Cuenta personal</p>
        <h1 className="app-title">Mi perfil</h1>
        <p className="app-subtitle">Actualiza tus datos personales y revisa la información de tu cuenta.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="app-card p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-400 text-lg font-black text-white shadow-lg shadow-indigo-500/15">
              {initials || <i className="pi pi-user" />}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-extrabold text-slate-900">{usuario.nombre} {usuario.apellido}</h2>
              <p className="mt-1 truncate text-sm text-slate-500">{usuario.email}</p>
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleUpdate();
            }}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Nombre</label>
                <InputText
                  value={usuario.nombre}
                  onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                  className="w-full"
                  placeholder="Nombre"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Apellido</label>
                <InputText
                  value={usuario.apellido}
                  onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
                  className="w-full"
                  placeholder="Apellido"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-700">Correo electrónico</label>
                <InputText
                  value={usuario.email}
                  onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                  className="w-full"
                  placeholder="Correo electrónico"
                />
              </div>
            </div>

            <div className="mt-7 flex justify-end">
              <Button
                label="Guardar cambios"
                icon="pi pi-check"
                type="submit"
                className="px-4"
              />
            </div>
          </form>
        </section>

        <aside className="space-y-6">
          <section className="app-card overflow-hidden">
            <div className="bg-slate-950 px-5 py-5 text-white">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-300">Información de cuenta</p>
              <p className="mt-2 text-sm text-slate-300">Datos internos de tu perfil.</p>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Username</p>
                <p className="mt-1.5 text-sm font-bold text-slate-800">@{usuario.username}</p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Último acceso</p>
                <p className="mt-1.5 text-sm font-semibold text-slate-700">
                  {usuario.ultimo_acceso ? new Date(usuario.ultimo_acceso).toLocaleString('es-ES') : 'Nunca'}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Roles</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {usuario.roles.map((rol) => (
                    <Tag
                      key={rol.id}
                      value={rol.nombre}
                      severity={rol.nombre === 'administrador' ? 'warning' : 'info'}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[1.25rem] border border-indigo-100 bg-indigo-50/80 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <i className="pi pi-lock" />
            </span>
            <h3 className="mt-4 text-sm font-extrabold text-slate-900">Seguridad</h3>
            <p className="mt-1.5 text-xs leading-5 text-slate-500">Actualiza tu contraseña cuando sea necesario.</p>
            <Button
              label="Cambiar contraseña"
              icon="pi pi-key"
              className="p-button-outlined mt-4 w-full"
              onClick={() => setShowPasswordDialog(true)}
              type="button"
            />
          </section>
        </aside>
      </div>

      <Dialog
        header="Cambiar contraseña"
        visible={showPasswordDialog}
        onHide={() => setShowPasswordDialog(false)}
        style={{ width: 'min(92vw, 30rem)' }}
        footer={
          <div className="flex justify-end gap-2">
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setShowPasswordDialog(false)} />
            <Button label="Actualizar" icon="pi pi-check" onClick={handleChangePassword} loading={loadingPassword} />
          </div>
        }
      >
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Contraseña actual</label>
            <Password value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full" inputClassName="w-full" feedback={false} toggleMask />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Nueva contraseña</label>
            <Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full" inputClassName="w-full" feedback toggleMask />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Confirmar contraseña</label>
            <Password value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full" inputClassName="w-full" feedback={false} toggleMask />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Perfil;
