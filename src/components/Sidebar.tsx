// src/components/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { roles, logout } = useAuth();
  const { collapsed, toggleSidebar } = useSidebar();
  const isAdmin = roles.some((rol: any) => rol.nombre === 'administrador');

  const menuItems = [
    { label: 'Dashboard', icon: 'pi pi-chart-bar', to: '/dashboard' },
    { label: 'Libros', icon: 'pi pi-book', to: '/libros' },
    { label: 'Préstamos', icon: 'pi pi-arrow-right', to: '/prestamos' },
    { label: 'Devoluciones', icon: 'pi pi-arrow-left', to: '/devoluciones' },
    { label: 'Autores', icon: 'pi pi-users', to: '/autores' },
    { label: 'Categorías', icon: 'pi pi-tags', to: '/categorias' },
    { label: 'Gestión de Usuarios', icon: 'pi pi-cog', to: '/configuracion', adminOnly: true },
    { label: 'Perfil', icon: 'pi pi-user', to: '/perfil' },
  ];

  return (
    <aside className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex h-16 items-center border-b border-slate-100 px-3">
        <div className={`flex flex-1 items-center gap-3 overflow-hidden ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
            <i className="pi pi-book text-lg" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">Biblioteca Digital</p>
              <p className="truncate text-xs text-slate-500">Gestión bibliotecaria</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button type="button" onClick={toggleSidebar} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label="Colapsar menú">
            <i className="pi pi-angle-left" />
          </button>
        )}
      </div>

      {collapsed && (
        <button type="button" onClick={toggleSidebar} className="mx-auto mt-3 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-orange-600" aria-label="Expandir menú">
          <i className="pi pi-bars" />
        </button>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {!collapsed && <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Navegación</p>}
        <ul className="space-y-1">
          {menuItems.filter((item) => !item.adminOnly || isAdmin).map((item) => {
            const active = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link to={item.to} title={collapsed ? item.label : undefined} className={`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all ${active ? 'bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'} ${collapsed ? 'justify-center' : ''}`}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white'}`}>
                    <i className={item.icon} />
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-100 p-2">
        <button onClick={logout} title={collapsed ? 'Cerrar sesión' : undefined} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700 ${collapsed ? 'justify-center' : ''}`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100"><i className="pi pi-sign-out" /></span>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
