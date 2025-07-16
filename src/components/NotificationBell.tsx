// src/components/NotificationBell.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Badge } from 'primereact/badge';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useAuth } from '../context/AuthContext';
import { prestamoService, Prestamo } from '../services/prestamoService';
import { devolucionService } from '../services/devolucionService';
import { useLocation } from 'react-router-dom';

interface Notification {
    id: string; // Puede ser string para evitar colisiones
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
        // Solo cargar notificaciones en rutas específicas
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
          <div className="relative">
            <i className="pi pi-bell text-2xl cursor-pointer" onClick={handleBellClick}>
              {notifications.length > 0 && !notificacionesLeidas && (
                <Badge value={notifications.length} severity="danger" className="absolute top-0 right-0" />
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
                      <p className="text-xs text-gray-500">{new Date(notif.fecha).toLocaleDateString()}</p>
                    </div>
                  ))
                )}
              </div>
            </OverlayPanel>
          </div>
        );
      };

export default NotificationBell;
