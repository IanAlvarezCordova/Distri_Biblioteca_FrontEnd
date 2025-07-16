// src/pages/Register.tsx
import React, { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    nombre?: string;
    apellido?: string;
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!apellido) newErrors.apellido = 'El apellido es obligatorio';
    if (!email) newErrors.email = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = 'El correo no es válido';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    else if (password.length < 6)
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    try {
      await authService.register(nombre, apellido, email, password);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Registro exitoso. Inicia sesión para continuar.',
        life: 3000,
      });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al registrar usuario',
        life: 3000,
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <Toast ref={toast} />
      <div className="card shadow p-4 w-100" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Registrarse</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="text"
                className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {errors.nombre && (
                <div className="invalid-feedback">{errors.nombre}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Apellido</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person-badge-fill"></i>
              </span>
              <input
                type="text"
                className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
              {errors.apellido && (
                <div className="invalid-feedback">{errors.apellido}</div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Correo</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                toggleMask
                feedback={false}
                inputClassName="border-0 w-100"
              />
              {errors.password && (
                <div className="invalid-feedback d-block">{errors.password}</div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary w-100 mb-3"
            onClick={handleRegister}
          >
            <i className="bi bi-person-plus me-2"></i>
            Registrarse
          </button>

          <p className="text-center">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-decoration-none">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
