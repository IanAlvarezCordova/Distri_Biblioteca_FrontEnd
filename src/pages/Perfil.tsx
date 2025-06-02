import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { usuarioService } from '../services/usuarioService';
import { useAuth } from '../context/AuthContext';

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
}

const Perfil: React.FC = () => {
    const toast = useRef<Toast>(null);
    const { user } = useAuth();
    const [usuario, setUsuario] = useState<Usuario | null>(null);

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
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al actualizar perfil', life: 3000 });
        }
    };

    if (!usuario) {
        return <div className="p-4">Cargando datos...</div>;
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <Toast ref={toast} />
            <h2 className="text-2xl font-semibold mb-4">Mi Perfil</h2>
            <Card className="shadow-md">
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">Nombre</label>
                        <InputText
                            value={usuario.nombre}
                            onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                            className="w-full"
                            placeholder="Nombre"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Apellido</label>
                        <InputText
                            value={usuario.apellido}
                            onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
                            className="w-full"
                            placeholder="Apellido"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Email</label>
                        <InputText
                            value={usuario.email}
                            onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                            className="w-full"
                            placeholder="Email"
                        />
                    </div>
                    <Button
                        label="Guardar Cambios"
                        icon="pi pi-save"
                        className="p-button-success w-full"
                        onClick={handleUpdate}
                    />
                </div>
            </Card>
        </div>
    );
};

export default Perfil;