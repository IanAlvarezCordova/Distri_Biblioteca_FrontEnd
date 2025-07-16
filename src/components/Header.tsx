// src/components/Header.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { sidebarWidth } = useSidebar();
  const navigate = useNavigate();
  const menu = React.useRef<Menu>(null);

  const items = [
    {
      label: user?.email || 'Usuario',
      items: [
        { label: 'Mi Perfil', icon: 'pi pi-user', command: () => navigate('/perfil') },
        { label: 'Cerrar Sesión', icon: 'pi pi-sign-out', command: () => logout() },
      ],
    },
  ];

  return (
    <header 
      className="fixed top-0 right-0 z-10 bg-white border-b shadow-sm px-6 py-2 flex justify-end items-center space-x-4 h-14 transition-all duration-300"
      style={{ left: sidebarWidth }}
    >
      <NotificationBell />
      <div>
        <Avatar icon="pi pi-user" className="cursor-pointer" shape="circle" onClick={(e) => menu.current?.toggle(e)} />
        <Menu model={items} popup ref={menu} />
      </div>
    </header>
  );
};

export default Header;
