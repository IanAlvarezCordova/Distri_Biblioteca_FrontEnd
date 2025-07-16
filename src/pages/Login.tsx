// src/pages/Login.tsx
import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useNavigate, Link } from 'react-router-dom';
import { Password } from 'primereact/password';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    // Validaciones locales
    if (!email || !password) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, completa todos los campos',
        life: 3000,
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'El correo no es válido',
        life: 3000,
      });
      return;
    }
    //contraseña mínima 5
    if (password.length < 5) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'La contraseña debe tener al menos 5 caracteres',
        life: 3000,
      });
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      // Depurar el mensaje de error
      console.log('Error recibido:', error.message);

      const message = error.message.toLowerCase().includes('el email no esta registrado')
        ? 'El correo no está registrado'
        : error.message.toLowerCase().includes('la contraseña es incorrecta')
        ? 'La contraseña es incorrecta'
        : error.message.toLowerCase().includes('permisos')
        ? 'No tienes permisos para realizar esta acción'
        : 'Error al iniciar sesión. Por favor, intenta de nuevo.';
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Toast ref={toast} />
      <div className="card shadow p-4 w-100" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo"
                className="form-control"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <Password
                feedback={false}
                value={password}
                toggleMask
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                inputClassName="border-0 w-100"
                className="form-control"
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-success w-100 mb-3"
            onClick={handleLogin}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Iniciar Sesión
          </button>

          <p className="text-center">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-decoration-none">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;