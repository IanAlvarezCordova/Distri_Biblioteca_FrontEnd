import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useNavigate, Link } from 'react-router-dom';
import { Password } from 'primereact/password';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa todos los campos', life: 3000 });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'El correo no es válido', life: 3000 });
      return;
    }
    if (password.length < 5) {
      toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'La contraseña debe tener al menos 5 caracteres', life: 3000 });
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.message.toLowerCase().includes('el email no esta registrado')
        ? 'El correo no está registrado'
        : error.message.toLowerCase().includes('la contraseña es incorrecta')
        ? 'La contraseña es incorrecta'
        : error.message.toLowerCase().includes('permisos')
        ? 'No tienes permisos para realizar esta acción'
        : 'Error al iniciar sesión. Por favor, intenta de nuevo.';
      toast.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
    }
  };

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-10">
      <Toast ref={toast} />
      <div className="auth-card w-full max-w-md rounded-3xl p-6 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
            <img src={logo} alt="Biblioteca Digital" className="h-12 w-12 object-contain" />
          </div>
          <p className="text-sm font-semibold text-orange-500">Biblioteca Digital</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Bienvenido de nuevo</h1>
          <p className="mt-2 text-sm text-slate-500">Ingresa con tus credenciales para continuar.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Correo electrónico</label>
            <span className="p-input-icon-left w-full">
              <i className="pi pi-envelope" />
              <InputText value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className="w-full pl-10" />
            </span>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Contraseña</label>
            <Password feedback={false} value={password} toggleMask onChange={(e) => setPassword(e.target.value)} placeholder="Ingresa tu contraseña" inputClassName="w-full" className="w-full" />
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
            Iniciar sesión <i className="pi pi-arrow-right" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">¿No tienes cuenta? <Link to="/register" className="font-semibold text-orange-600 hover:text-orange-700">Regístrate</Link></p>
        <Link to="/" className="mt-3 block text-center text-xs font-medium text-slate-400 hover:text-slate-600">Volver al inicio</Link>
      </div>
    </main>
  );
};

export default Login;
