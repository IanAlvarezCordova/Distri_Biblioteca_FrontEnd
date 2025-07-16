// src/components/Header.tsx
import React, { useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { sidebarWidth } = useSidebar();
  const navigate = useNavigate();
  const op = useRef<OverlayPanel>(null);

  return (
    <header
      className="fixed top-0 right-0 z-10 bg-white border-b shadow-sm px-6 py-2 flex justify-end items-center space-x-4 h-14 transition-all duration-300"
      style={{ left: sidebarWidth }}
    >
      <NotificationBell />
      <div>
        <Button
          icon="pi pi-user"
          className="p-button-rounded p-button-text p-button-lg text-orange-500 border border-orange-200 shadow"
          style={{ width: 44, height: 44, fontSize: 22 }}
          onClick={(e) => op.current?.toggle(e)}
          aria-label="Menú de usuario"
        />
        <OverlayPanel ref={op} className="w-72 p-0">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <i className="pi pi-user text-3xl text-orange-500" />
              <div className="flex-1 min-w-0">
                <div
                  className="font-semibold text-gray-800 truncate"
                  title={user?.email}
                  style={{ maxWidth: 180 }}
                >
                  {user?.email}
                </div>
              </div>
            </div>
            <hr className="my-2" />
            <Button
              label="Mi Perfil"
              icon="pi pi-id-card"
              className="p-button-text w-full justify-start mb-2"
              onClick={() => {
                op.current?.hide();
                navigate('/perfil');
              }}
            />
            <Button
              label="Cerrar Sesión"
              icon="pi pi-sign-out"
              className="p-button-text w-full justify-start text-red-600"
              onClick={logout}
            />
          </div>
        </OverlayPanel>
      </div>
    </header>
  );
};

export default Header;
