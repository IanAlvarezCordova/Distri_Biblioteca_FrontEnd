import React, { useRef, useState } from 'react';
import { Password } from 'primereact/password';
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
  const [errors, setErrors] = useState<{ nombre?: string; apellido?: string; email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!apellido) newErrors.apellido = 'El apellido es obligatorio';
    if (!email) newErrors.email = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'El correo no es válido';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    else if (password.length < 5) newErrors.password = 'La contraseña debe tener al menos 5 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !password) {
      toast.current?.show({ severity: 'warn', summary: 'Campos incompletos', detail: 'Completa todos los campos', life: 3000 });
      return;
    }
    if (nombre.trim().split(/\s+/).length > 1) {
      toast.current?.show({ severity: 'warn', summary: 'Nombre inválido', detail: 'Solo se permite un único nombre', life: 3000 });
      return;
    }
    if (apellido.trim().split(/\s+/).length > 1) {
      toast.current?.show({ severity: 'warn', summary: 'Apellido inválido', detail: 'Solo se permite un único apellido', life: 3000 });
      return;
    }
    if (!validateForm()) return;

    try {
      await authService.register(nombre, apellido, email, password);
      toast.current?.show({ severity: 'success', summary: 'Cuenta creada', detail: 'Registro exitoso. Inicia sesión para continuar.', life: 3000 });
      setTimeout(() => navigate('/login'), 1800);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'No se pudo registrar', detail: 'Verifica tus datos e intenta nuevamente', life: 3000 });
    }
  };

  const inputClass = (error?: string) =>
    `w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition ${
      error
        ? 'border-rose-400 ring-2 ring-rose-100'
        : 'border-slate-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
    }`;

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <Toast ref={toast} />

      <div className="auth-card w-full max-w-2xl rounded-[2rem] p-6 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="app-eyebrow">Nueva cuenta</p>
            <h1 className="app-title">Únete a la biblioteca</h1>
            <p className="app-subtitle">Crea tu perfil para acceder al catálogo y gestionar tus préstamos.</p>
          </div>
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20 sm:flex">
            <i className="pi pi-user-plus" />
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="mt-8 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={inputClass(errors.nombre)}
                placeholder="Ian"
                autoComplete="given-name"
              />
              {errors.nombre && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.nombre}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Apellido</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className={inputClass(errors.apellido)}
                placeholder="Alvarez"
                autoComplete="family-name"
              />
              {errors.apellido && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.apellido}</p>}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass(errors.email)}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
            />
            {errors.email && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.email}</p>}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">Contraseña</label>
              <span className="text-xs font-medium text-slate-400">Mínimo 5 caracteres</span>
            </div>
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              feedback
              placeholder="Crea una contraseña"
              className="w-full"
              inputClassName={`w-full ${errors.password ? 'p-invalid' : ''}`}
              autoComplete="new-password"
            />
            {errors.password && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Crear mi cuenta <i className="pi pi-arrow-right text-xs" />
          </button>
        </form>

        <div className="mt-7 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-sm sm:flex-row">
          <Link to="/" className="font-semibold text-slate-400 transition hover:text-slate-600">
            <i className="pi pi-arrow-left mr-2 text-xs" /> Volver al inicio
          </Link>
          <p className="text-slate-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-extrabold text-indigo-600 hover:text-indigo-700">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
