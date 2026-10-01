import React, { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import logo from '../assets/logo.png';

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
      toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, completa todos los campos', life: 3000 });
      return;
    }
    if (nombre.split(' ').length > 1) {
      toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Solo se permite un único nombre', life: 3000 });
      return;
    }
    if (apellido.split(' ').length > 1) {
      toast.current?.show({ severity: 'warn', summary: 'Advertencia', detail: 'Solo se permite un único apellido', life: 3000 });
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
    if (!validateForm()) return;

    try {
      await authService.register(nombre, apellido, email, password);
      toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Registro exitoso. Inicia sesión para continuar.', life: 3000 });
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al registrar usuario', life: 3000 });
    }
  };

  const fieldClass = (hasError?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-slate-800 outline-none transition ${hasError ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100'}`;

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-10">
      <Toast ref={toast} />
      <div className="auth-card w-full max-w-lg rounded-3xl p-6 sm:p-8">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
            <img src={logo} alt="Biblioteca Digital" className="h-10 w-10 object-contain" />
          </div>
          <p className="text-sm font-semibold text-orange-500">Biblioteca Digital</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Crea tu cuenta</h1>
          <p className="mt-2 text-sm text-slate-500">Completa tus datos para comenzar.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Nombre</label>
              <input type="text" className={fieldClass(errors.nombre)} value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
              {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Apellido</label>
              <input type="text" className={fieldClass(errors.apellido)} value={apellido} onChange={(e) => setApellido(e.target.value)} placeholder="Apellido" />
              {errors.apellido && <p className="mt-1 text-xs text-red-600">{errors.apellido}</p>}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Correo electrónico</label>
            <input type="email" className={fieldClass(errors.email)} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Contraseña</label>
            <Password value={password} onChange={(e) => setPassword(e.target.value)} className="w-full" inputClassName={`w-full ${errors.password ? 'p-invalid' : ''}`} toggleMask feedback placeholder="Mínimo 5 caracteres" />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <button type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
            Crear cuenta <i className="pi pi-user-plus" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700">Inicia sesión</Link></p>
        <Link to="/" className="mt-3 block text-center text-xs font-medium text-slate-400 hover:text-slate-600">Volver al inicio</Link>
      </div>
    </main>
  );
};

export default Register;
