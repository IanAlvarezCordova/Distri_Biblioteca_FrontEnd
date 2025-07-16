import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Tooltip } from 'primereact/tooltip';
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
                const userData = await usuarioService.findById(user.id);
                setUsuario(userData);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar datos del usuario', life: 3000 });
            }
        };
        fetchUser();
    }, [user]);

    const handleUpdate = async () => {
        if (!usuario?.nombre || !usuario?.apellido || !usuario?.email) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Todos los campos son obligatorios', life: 3000 });
            return;
        }

        try {
            await usuarioService.update(usuario.id, {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
            });
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado', life: 3000 });
        } catch (error: any) {
            const message = error.message.toLowerCase().includes('forbidden resource')
                ? 'No tienes permisos para realizar esta acción.'
                : error.message;
            toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Completa todos los campos', life: 3000 });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Las contraseñas no coinciden', life: 3000 });
            return;
        }
        setLoadingPassword(true);
        try {
            await usuarioService.update(usuario!.id, {
                password: newPassword,
                currentPassword: currentPassword,
            });
            toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada', life: 3000 });
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

    const passwordDialogFooter = (
        <div className="flex justify-end gap-2">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => setShowPasswordDialog(false)}
            />
            <Button
                label="Actualizar contraseña"
                icon="pi pi-check"
                className="p-button-success"
                onClick={handleChangePassword}
                loading={loadingPassword}
            />
        </div>
    );

    if (!usuario) {
        return (
            <div className="p-4 flex justify-center items-center min-h-screen">
                <Card className="shadow-md glass-card animate-fade-in-up">
                    <p className="text-center text-gray-600">Cargando datos...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 flex justify-center items-center min-h-screen">
            <Toast ref={toast} />
            <Card className="shadow-md glass-card w-full max-w-lg animate-scale-in px-4 py-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 animate-fade-in-up">Mi Perfil</h2>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        handleUpdate();
                    }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-semibold text-gray-700">Nombre</label>
                            <InputText
                                value={usuario.nombre}
                                onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                                className="w-full"
                                placeholder="Nombre"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold text-gray-700">Apellido</label>
                            <InputText
                                value={usuario.apellido}
                                onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
                                className="w-full"
                                placeholder="Apellido"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block mb-1 font-semibold text-gray-700">Email</label>
                            <InputText
                                value={usuario.email}
                                onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                                className="w-full"
                                placeholder="Email"
                            />
                        </div>
                    </div>
                    {/* Botón de guardar */}
                    <div className="flex justify-end mt-2">
                        <Button
                            label="Guardar Cambios"
                            icon="pi pi-save"
                            className="p-button-success"
                            onClick={handleUpdate}
                            data-pr-tooltip="Guardar cambios del perfil"
                            type="submit"
                        />
                    </div>
                    {/* Datos solo lectura */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                        <div>
                            <label className="block mb-1 font-semibold text-gray-700">Username</label>
                            <InputText value={usuario.username} className="w-full" disabled />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold text-gray-700">Último acceso</label>
                            <InputText
                                value={usuario.ultimo_acceso ? new Date(usuario.ultimo_acceso).toLocaleString('es-ES') : 'Nunca'}
                                className="w-full"
                                disabled
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block mb-1 font-semibold text-gray-700">Roles</label>
                            <div className="flex flex-wrap gap-2">
                                {usuario.roles.map((rol, idx) => (
                                    <Tag
                                        key={idx}
                                        value={rol.nombre}
                                        severity={rol.nombre === 'administrador' ? 'danger' : 'info'}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${idx * 0.1}s` }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Botón de cambiar contraseña */}
                    <div className="flex justify-end mt-2">
                        <Button
                            label={showPasswordDialog ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
                            icon="pi pi-key"
                            className="p-button-secondary"
                            onClick={() => setShowPasswordDialog(!showPasswordDialog)}
                            data-pr-tooltip="Cambiar la contraseña del usuario"
                            type="button"
                        />
                    </div>
                    <Tooltip target=".p-button" />
                </form>
            </Card>

            <Dialog
                header="Cambiar Contraseña"
                visible={showPasswordDialog}
                onHide={() => setShowPasswordDialog(false)}
                style={{ width: 'clamp(20rem, 90vw, 30rem)' }}
                footer={passwordDialogFooter}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold text-gray-700">Contraseña actual</label>
                        <Password
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full"
                            feedback={false}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-gray-700">Nueva contraseña</label>
                        <Password
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full"
                            feedback={true}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold text-gray-700">Confirmar nueva contraseña</label>
                        <Password
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full"
                            feedback={false}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Perfil;