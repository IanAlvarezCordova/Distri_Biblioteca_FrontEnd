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

  const isAdmin = roles.includes('administrador');

  const menuItems = [
    { label: 'Dashboard', icon: 'pi pi-chart-bar', to: '/dashboard' },
    { label: 'Libros', icon: 'pi pi-book', to: '/libros' },
    { label: 'Préstamos', icon: 'pi pi-arrow-right', to: '/prestamos' },
    { label: 'Devoluciones', icon: 'pi pi-arrow-left', to: '/devoluciones' },
    { label: 'Autores', icon: 'pi pi-users', to: '/autores' },
    { label: 'Categorías', icon: 'pi pi-tags', to: '/categorias' },
    { label: 'Gestión de Usuarios', icon: 'pi pi-user-edit', to: '/configuracion', adminOnly: true },
    { label: 'Perfil', icon: 'pi pi-user', to: '/perfil' },
    { label: 'Cerrar Sesión', icon: 'pi pi-sign-out', to: '/', className: 'text-red-500', command: () => logout() },
  ];

  return (
    <div className={`h-screen bg-white border-r text-gray-800 transition-all duration-300 fixed left-0 top-0 z-40 flex flex-col ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <h2 className="text-lg font-bold text-gray-700">Menú</h2>}
        <Button
          icon={`pi ${collapsed ? 'pi-bars' : 'pi-times'}`}
          className="p-button-text text-gray-700"
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        />
      </div>

      <ul className="flex-1 px-2">
        {menuItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map((item, index) => (
            <li key={index} className="mb-1">
              <Link
                to={item.to}
                onClick={(e) => {
                  if (item.command) {
                    e.preventDefault();
                    item.command();
                  }
                }}
                className={`flex items-center gap-2 p-2 rounded transition-all hover:bg-gray-100 ${
                  location.pathname === item.to ? 'bg-gray-200 font-semibold' : ''
                } ${item.className || ''}`}
              >
                <i className={`${item.icon} text-lg ${collapsed ? 'mx-auto' : ''}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;
