// src/components/Sidebar.tsx
import React from 'react';
import { Button } from 'primereact/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { roles, logout } = useAuth();
  const { collapsed, toggleSidebar } = useSidebar();
  const isAdmin = roles.some((rol: any) => rol.nombre === 'administrador');

  const menuItems = [
    { label: 'Dashboard', icon: 'pi pi-chart-bar', to: '/dashboard', color: 'bg-blue-100 text-blue-700' },
    { label: 'Libros', icon: 'pi pi-book', to: '/libros', color: 'bg-orange-100 text-orange-700' },
    { label: 'Préstamos', icon: 'pi pi-arrow-right', to: '/prestamos', color: 'bg-green-100 text-green-700' },
    { label: 'Devoluciones', icon: 'pi pi-arrow-left', to: '/devoluciones', color: 'bg-teal-100 text-teal-700' },
    { label: 'Autores', icon: 'pi pi-users', to: '/autores', color: 'bg-purple-100 text-purple-700' },
    { label: 'Categorías', icon: 'pi pi-tags', to: '/categorias', color: 'bg-pink-100 text-pink-700' },
    { label: 'Gestión de Usuarios', icon: 'pi pi-users', to: '/configuracion', adminOnly: true, color: 'bg-yellow-100 text-yellow-700' },
    //{ label: 'Gestión de Usuarios', icon: 'pi pi-users', to: '/gestion-usuarios', adminOnly: true },
    { label: 'Perfil', icon: 'pi pi-user', to: '/perfil', color: 'bg-gray-100 text-gray-700' },
  ];

  return (
    <div className={`h-screen bg-gradient-to-b from-white via-slate-50 to-slate-200 border-r transition-all duration-300 fixed left-0 top-0 z-40 flex flex-col shadow-lg ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <h2 className="text-xl font-bold text-orange-500 tracking-wide">Biblioteca</h2>}
        <Button
          icon={`pi ${collapsed ? 'pi-bars' : 'pi-times'}`}
          className="p-button-text text-gray-700"
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        />
      </div>

      <ul className="flex-1 px-2 space-y-2 mt-2">
        {menuItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  shadow-sm hover:shadow-md hover:scale-[1.03] hover:bg-opacity-90
                  ${item.color}
                  ${location.pathname === item.to ? 'ring-2 ring-orange-400 scale-105' : ''}
                  ${collapsed ? 'justify-center px-2 py-2' : ''}
                `}
                style={{ minHeight: '3rem' }}
              >
                <i className={`${item.icon} text-2xl`} />
                {!collapsed && <span className="text-base">{item.label}</span>}
              </Link>
            </li>
          ))}
        {/* Separador visual */}
        <li className="my-2 border-t border-slate-200" />
        <li>
          <button
            onClick={logout}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
              bg-red-100 text-red-700 hover:bg-red-200 hover:scale-[1.03] shadow-sm
              w-full ${collapsed ? 'justify-center px-2 py-2' : ''}
            `}
            style={{ minHeight: '3rem' }}
          >
            <i className="pi pi-sign-out text-2xl" />
            {!collapsed && <span className="text-base">Cerrar Sesión</span>}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
