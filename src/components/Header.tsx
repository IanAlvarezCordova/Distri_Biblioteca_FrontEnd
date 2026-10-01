import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import NotificationBell from './NotificationBell';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Resumen general de tu biblioteca' },
  '/libros': { title: 'Libros', subtitle: 'Catálogo, disponibilidad y organización' },
  '/prestamos': { title: 'Préstamos', subtitle: 'Seguimiento de libros prestados' },
  '/devoluciones': { title: 'Devoluciones', subtitle: 'Recepción y control de devoluciones' },
  '/autores': { title: 'Autores', subtitle: 'Gestiona los autores del catálogo' },
  '/categorias': { title: 'Categorías', subtitle: 'Organiza el catálogo por categorías' },
  '/configuracion': { title: 'Usuarios', subtitle: 'Administración de usuarios y roles' },
  '/perfil': { title: 'Mi perfil', subtitle: 'Información personal y seguridad' },
};

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { sidebarWidth } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const op = useRef<OverlayPanel>(null);
  const currentPage = pageTitles[location.pathname] || {
    title: 'Biblioteca Digital',
    subtitle: 'Sistema de gestión bibliotecaria',
  };

  const displayName = user?.email?.split('@')[0] || 'Usuario';

  return (
    <header
      className="fixed right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 shadow-sm shadow-slate-200/30 backdrop-blur-xl transition-[left] duration-300 sm:px-6 lg:px-8"
      style={{ left: sidebarWidth }}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="hidden h-2 w-2 rounded-full bg-cyan-400 sm:block" />
          <p className="truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
            {currentPage.title}
          </p>
        </div>
        <p className="mt-0.5 hidden truncate text-xs font-medium text-slate-500 sm:block">
          {currentPage.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <NotificationBell />

        <button
          type="button"
          onClick={(e) => op.current?.toggle(e)}
          className="flex h-11 items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-2.5 text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/60"
          aria-label="Menú de usuario"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-xs font-extrabold uppercase text-white">
            {displayName.slice(0, 2)}
          </span>
          <span className="hidden max-w-36 truncate text-sm font-bold md:block">{displayName}</span>
          <i className="pi pi-angle-down text-[10px] text-slate-400" />
        </button>

        <OverlayPanel ref={op} className="w-72 p-0">
          <div className="p-4">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Cuenta activa</p>
            <p className="mt-2 truncate text-sm font-bold text-slate-800" title={user?.email}>{user?.email}</p>
            <div className="my-3 border-t border-slate-100" />
            <Button
              label="Mi perfil"
              icon="pi pi-user"
              className="p-button-text mb-1 w-full justify-start"
              onClick={() => {
                op.current?.hide();
                navigate('/perfil');
              }}
            />
            <Button
              label="Cerrar sesión"
              icon="pi pi-sign-out"
              className="p-button-text w-full justify-start text-rose-600"
              onClick={logout}
            />
          </div>
        </OverlayPanel>
      </div>
    </header>
  );
};

export default Header;
