// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

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
  const { isAuthenticated, roles } = useAuth();
  const isAdmin = roles.includes('administrador');

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {isAuthenticated && <Sidebar />}

        <div className="flex-1 flex flex-col">
          {isAuthenticated && <Header />}

          <main className={`p-4 md:p-6 flex-1 ${isAuthenticated ? 'mt-20' : ''}`}>
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route
                path="/dashboard"
                element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/libros"
                element={isAuthenticated ? <Libros /> : <Navigate to="/login" />}
              />
              <Route
                path="/prestamos"
                element={isAuthenticated ? <Prestamos /> : <Navigate to="/login" />}
              />
              <Route
                path="/devoluciones"
                element={isAuthenticated ? <Devoluciones /> : <Navigate to="/login" />}
              />
              <Route
                path="/configuracion"
                element={
                  isAuthenticated && isAdmin ? (
                    <Configuracion />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                }
              />
              <Route
                path="/autores"
                element={isAuthenticated ? <Autores /> : <Navigate to="/login" />}
              />
              <Route
                path="/categorias"
                element={isAuthenticated ? <Categorias /> : <Navigate to="/login" />}
              />
              <Route
                path="/perfil"
                element={isAuthenticated ? <Perfil /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
              />
              <Route
                path="/register"
                element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
