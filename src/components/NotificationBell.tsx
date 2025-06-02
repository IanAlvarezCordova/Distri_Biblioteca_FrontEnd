// src/components/NotificationBell.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Badge } from 'primereact/badge';
import { OverlayPanel } from 'primereact/overlaypanel';

interface Notification {
    id: number;
    mensaje: string;
    fecha: string;
}

interface Props {
    count: number;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const NotificationBell: React.FC<Props> = ({ count, onClick }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const op = useRef<OverlayPanel>(null);

    useEffect(() => {
        setNotifications([
            { id: 1, mensaje: 'Préstamo vencido: Cien Años de Soledad', fecha: '2025-06-01' },
            { id: 2, mensaje: 'Nuevo usuario registrado', fecha: '2025-06-02' },
        ]);
    }, []);

    return (
        <div className="relative">
            <i
                className="pi pi-bell text-2xl cursor-pointer"
                onClick={(e) => {
                    op.current?.toggle(e);
                    onClick(e); // Llamamos al onClick externo
                }}
            >
                {count > 0 && (
                    <Badge value={count} severity="danger" className="absolute top-0 right-0" />
                )}
            </i>
            <OverlayPanel ref={op} className="w-64">
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Notificaciones</h3>
                    {notifications.length === 0 ? (
                        <p className="text-gray-500">No hay notificaciones</p>
                    ) : (
                        notifications.map((notif) => (
                            <div key={notif.id} className="p-2 border-b">
                                <p className="text-sm">{notif.mensaje}</p>
                                <p className="text-xs text-gray-500">{notif.fecha}</p>
                            </div>
                        ))
                    )}
                </div>
            </OverlayPanel>
        </div>
    );
};

export default NotificationBell;
