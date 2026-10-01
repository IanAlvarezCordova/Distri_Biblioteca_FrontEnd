import React, { useState, useEffect, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useAuth } from '../context/AuthContext';
import { prestamoService, Prestamo } from '../services/prestamoService';
import { devolucionService } from '../services/devolucionService';
import { useLocation } from 'react-router-dom';

interface Notification {
    id: string;
    mensaje: string;
    fecha: string;
}

const NotificationBell: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificacionesLeidas, setNotificacionesLeidas] = useState(false);
    const op = useRef<OverlayPanel>(null);
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const allowedPaths = ['/dashboard', '/prestamos', '/devoluciones'];
        if (!user || !allowedPaths.includes(location.pathname)) {
            setNotifications([]);
            return;
        }

        const fetchNotifications = async () => {
            try {
                const prestamos: Prestamo[] = await prestamoService.findByUsuarioId(user.id);
                const hoy = new Date();
                const prestamosNotifs = prestamos
                    .filter((p) => !p.devuelto && p.fecha_devolucion)
                    .filter((p) => {
                        const fechaDev = new Date(p.fecha_devolucion as string);
                        const diff = (fechaDev.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
                        return diff <= 3;
                    })
                    .map((p) => ({
                        id: `prestamo-${p.id}`,
                        mensaje:
                            new Date(p.fecha_devolucion as string) < hoy
                                ? `¡Préstamo vencido! Libro: ${p.libro.titulo}`
                                : `Pronto vence el préstamo: ${p.libro.titulo}`,
                        fecha: p.fecha_devolucion as string,
                    }));

                const devoluciones = await devolucionService.findAll();
                const misDevoluciones = devoluciones
                    .filter((d: any) => d.usuario.id === user.id)
                    .sort((a: any, b: any) => new Date(b.fecha_devolucion).getTime() - new Date(a.fecha_devolucion).getTime());
                const ultimaDevolucion = misDevoluciones[0];
                let devolucionNotif: Notification[] = [];
                if (ultimaDevolucion) {
                    devolucionNotif = [
                        {
                            id: `devolucion-${ultimaDevolucion.id}`,
                            mensaje: `Has devuelto el libro: ${ultimaDevolucion.libro.titulo}`,
                            fecha: ultimaDevolucion.fecha_devolucion,
                        },
                    ];
                }

                setNotifications([...devolucionNotif, ...prestamosNotifs]);
                setNotificacionesLeidas(false);
            } catch {
                setNotifications([]);
            }
        };

        fetchNotifications();
    }, [user, location.pathname]);

    const handleBellClick = (e: React.MouseEvent) => {
        op.current?.toggle(e);
        setNotificacionesLeidas(true);
    };

    return (
        <div className="relative flex items-center">
            <button
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none"
                onClick={handleBellClick}
                aria-label="Notificaciones"
            >
                <i className="pi pi-bell text-base" />
                {notifications.length > 0 && !notificacionesLeidas && (
                    <span
                        className="absolute top-0 right-0 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold"
                        style={{
                            width: 20, // Slightly larger badge
                            height: 20,
                            minWidth: 20,
                            minHeight: 20,
                            fontSize: 12, // Slightly larger font
                            zIndex: 2,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                            border: '2px solid #fff',
                            transform: 'translate(25%, -25%)', // Adjust position to avoid overlap
                        }}
                    >
                        {notifications.length}
                    </span>
                )}
            </button>
            <OverlayPanel ref={op} className="w-72 p-0">
                <div className="p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900">
                        <i className="pi pi-bell" /> Notificaciones
                    </h3>
                    {notifications.length === 0 ? (
                        <p className="py-5 text-center text-sm text-slate-500">No hay notificaciones</p>
                    ) : (
                        notifications.map((notif) => (
                            <div key={notif.id} className="border-b border-slate-100 px-1 py-3 last:border-b-0">
                                <p className="text-sm font-medium text-slate-700">{notif.mensaje}</p>
                                <p className="mt-1 text-xs text-slate-400">{new Date(notif.fecha).toLocaleDateString()}</p>
                            </div>
                        ))
                    )}
                </div>
            </OverlayPanel>
        </div>
    );
};

export default NotificationBell;