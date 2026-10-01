// src/components/Header.tsx
import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import NotificationBell from './NotificationBell';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Resumen de actividad' },
  '/libros': { title: 'Libros', subtitle: 'Catálogo bibliográfico' },
  '/prestamos': { title: 'Préstamos', subtitle: 'Gestión de préstamos' },
  '/devoluciones': { title: 'Devoluciones', subtitle: 'Control de devoluciones' },
  '/autores': { title: 'Autores', subtitle: 'Administración de autores' },
  '/categorias': { title: 'Categorías', subtitle: 'Organización del catálogo' },
  '/configuracion': { title: 'Usuarios', subtitle: 'Administración del sistema' },
  '/perfil': { title: 'Mi perfil', subtitle: 'Información de tu cuenta' },
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { sidebarWidth } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const op = useRef<OverlayPanel>(null);
  const currentPage = pageTitles[location.pathname] || { title: 'Biblioteca', subtitle: 'Sistema de gestión' };

  return (
    <header className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur transition-all duration-300 sm:px-6" style={{ left: sidebarWidth }}>
      <div className="min-w-0">
        <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">{currentPage.title}</h1>
        <p className="hidden text-xs text-slate-500 sm:block">{currentPage.subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
        <button type="button" onClick={(e) => op.current?.toggle(e)} className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50" aria-label="Menú de usuario">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600"><i className="pi pi-user text-sm" /></span>
          <span className="hidden max-w-40 truncate text-sm font-medium md:block">{user?.email}</span>
          <i className="pi pi-angle-down text-xs text-slate-400" />
        </button>
        <OverlayPanel ref={op} className="w-72 p-0">
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cuenta</p>
            <p className="mt-2 truncate font-semibold text-slate-800" title={user?.email}>{user?.email}</p>
            <div className="my-3 border-t border-slate-100" />
            <Button label="Mi Perfil" icon="pi pi-id-card" className="p-button-text w-full justify-start mb-2" onClick={() => { op.current?.hide(); navigate('/perfil'); }} />
            <Button label="Cerrar Sesión" icon="pi pi-sign-out" className="p-button-text w-full justify-start text-red-600" onClick={logout} />
          </div>
        </OverlayPanel>
      </div>
    </header>
  );
};

export default Header;
