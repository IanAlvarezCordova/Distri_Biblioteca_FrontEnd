// components/Navbar.tsx
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, roles } = useAuth();
    const isAdmin = roles.includes('administrador');

  const items = isAuthenticated
    ? [
        { label: 'Dashboard', icon: 'pi pi-home', command: () => navigate('/dashboard') },
        { label: 'Vehículos', icon: 'pi pi-car', command: () => navigate('/vehiculos') },
        { label: 'Talleres', icon: 'pi pi-wrench', command: () => navigate('/talleres') },
        { label: 'Registros de Servicio', icon: 'pi pi-book', command: () => navigate('/registro-servicio') },
        { label: 'Reportes', icon: 'pi pi-chart-line', command: () => navigate('/reportes') },
        ...(isAdmin ? [{ label: 'Configuración', icon: 'pi pi-users', command: () => navigate('/configuracion') }] : []),
        { label: 'Perfil', icon: 'pi pi-user', command: () => navigate('/perfil') },
        {
          label: 'Cerrar Sesión',
          icon: 'pi pi-sign-out',
          command: () => {
            logout();
          },
        },
      ]
    : [];

  return <Menubar model={items} />;
};