import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import Inicio from './pages/Inicio';
import Dashboard from './pages/Dashboard';
import Libros from './pages/Libros';
import Prestamos from './pages/Prestamos';
import Devoluciones from './pages/Devoluciones';
import Configuracion from './pages/Configuracion';
import Autores from './pages/Autores';
import Categorias from './pages/Categorias';
import Perfil from './pages/Perfil';
import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AdminRoute from './routes/AdminRoute';

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <SidebarProvider>
      <AuthenticatedApp />
    </SidebarProvider>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { sidebarWidth } = useSidebar();

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      <Sidebar />
      <Header />

      <main
        className="min-h-screen px-4 pb-10 pt-24 transition-[margin] duration-300 sm:px-6 lg:px-8"
        style={{ marginLeft: sidebarWidth }}
      >
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/libros" element={<Libros />} />
          <Route path="/prestamos" element={<Prestamos />} />
          <Route path="/devoluciones" element={<Devoluciones />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/autores" element={<Autores />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route element={<AdminRoute />}>
            <Route path="/configuracion" element={<Configuracion />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
