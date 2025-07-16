// src/routes/AdminRoute.tsx
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

// src/routes/AdminRoute.tsx
const AdminRoute = () => {
  const { isAuthenticated, roles } = useAuth();
  console.log('Roles en AdminRoute:', roles); // Añade esta línea
  const isAdmin = roles.some((rol: any) => rol.nombre === 'administrador');
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;
  return <Outlet />;
};

export default AdminRoute;