// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
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

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, roles } = useAuth();
  const isAdmin = roles.includes('administrador');

  console.log('🔍 AppContent - Estado de autenticación:');
  console.log('  - isAuthenticated:', isAuthenticated);
  console.log('  - roles:', roles);
  console.log('  - isAdmin:', isAdmin);

  return (
    <>
      {!isAuthenticated ? (
        // Layout para páginas no autenticadas
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        // Layout para aplicación autenticada con contexto del sidebar
        <SidebarProvider>
          <AuthenticatedApp isAdmin={isAdmin} />
        </SidebarProvider>
      )}
    </>
  );
};

// Componente separado para la aplicación autenticada
const AuthenticatedApp: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const { sidebarWidth } = useSidebar();
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        
        <main 
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 transition-all duration-300"
          style={{ 
            marginLeft: sidebarWidth === 'collapsed' ? '70px' : '250px'
          }}
        >
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/libros" element={<Libros />} />
            <Route path="/prestamos" element={<Prestamos />} />
            <Route path="/devoluciones" element={<Devoluciones />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/autores" element={<Autores />} />
            <Route path="/categorias" element={<Categorias />} />
            {isAdmin && <Route path="/configuracion" element={<Configuracion />} />}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
