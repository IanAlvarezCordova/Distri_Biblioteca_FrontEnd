// src/pages/Register.tsx
import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
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
    const newErrors: {
      nombre?: string;
      apellido?: string;
      email?: string;
      password?: string;
    } = {};
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
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <Toast ref={toast} />
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 animate-text-reveal">
          Registrarse
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Nombre
            </label>
            <InputText
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full ${errors.nombre ? 'p-invalid' : ''}`}
            />
            {errors.nombre && (
              <small className="p-error block mt-1">{errors.nombre}</small>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Apellido
            </label>
            <InputText
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className={`w-full ${errors.apellido ? 'p-invalid' : ''}`}
            />
            {errors.apellido && (
              <small className="p-error block mt-1">{errors.apellido}</small>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Correo
            </label>
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full ${errors.email ? 'p-invalid' : ''}`}
            />
            {errors.email && (
              <small className="p-error block mt-1">{errors.email}</small>
            )}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Contraseña
            </label>
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full ${errors.password ? 'p-invalid' : ''}`}
              toggleMask
              feedback={false}
            />
            {errors.password && (
              <small className="p-error block mt-1">{errors.password}</small>
            )}
          </div>
          <Button
            label="Registrarse"
            className="w-full p-button-primary"
            onClick={handleRegister}
          />
          <p className="text-center text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;