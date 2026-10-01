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
    { label: 'Dashboard', icon: 'pi pi-th-large', to: '/dashboard' },
    { label: 'Libros', icon: 'pi pi-book', to: '/libros' },
    { label: 'Préstamos', icon: 'pi pi-arrow-up-right', to: '/prestamos' },
    { label: 'Devoluciones', icon: 'pi pi-arrow-down-left', to: '/devoluciones' },
    { label: 'Autores', icon: 'pi pi-users', to: '/autores' },
    { label: 'Categorías', icon: 'pi pi-tags', to: '/categorias' },
    { label: 'Gestión de Usuarios', icon: 'pi pi-shield', to: '/configuracion', adminOnly: true },
    { label: 'Perfil', icon: 'pi pi-user', to: '/perfil' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden bg-slate-950 text-slate-200 shadow-2xl shadow-slate-950/10 transition-[width] duration-300 ${collapsed ? 'w-[4.75rem]' : 'w-[16.5rem]'}`}
    >
      <div className="flex h-20 items-center border-b border-white/10 px-3">
        <div className={`flex min-w-0 flex-1 items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-950/30">
            <i className="pi pi-book text-lg" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-tight text-white">Biblioteca Digital</p>
              <p className="mt-0.5 truncate text-[11px] text-slate-400">Gestión bibliotecaria</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Colapsar menú"
          >
            <i className="pi pi-angle-left" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="mx-auto mt-3 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Expandir menú"
        >
          <i className="pi pi-bars" />
        </button>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-5">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
            Navegación
          </p>
        )}

        <ul className="m-0 list-none space-y-1 p-0">
          {menuItems
            .filter((item) => !item.adminOnly || isAdmin)
            .map((item) => {
              const active = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    className={`group flex min-h-12 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-950/25'
                        : 'text-slate-400 hover:bg-white/[0.07] hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${
                      active ? 'bg-white/15 text-white' : 'bg-white/[0.06] text-slate-400 group-hover:text-cyan-300'
                    }`}>
                      <i className={item.icon} />
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>

      <div className="border-t border-white/10 p-2">
        <button
          onClick={logout}
          title={collapsed ? 'Cerrar sesión' : undefined}
          className={`flex min-h-12 w-full items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300 ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[0.06]">
            <i className="pi pi-sign-out" />
          </span>
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
