import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.current?.show({ severity: 'warn', summary: 'Campos incompletos', detail: 'Completa correo y contraseña', life: 3000 });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.current?.show({ severity: 'warn', summary: 'Correo inválido', detail: 'Ingresa un correo electrónico válido', life: 3000 });
      return;
    }
    if (password.length < 5) {
      toast.current?.show({ severity: 'warn', summary: 'Contraseña inválida', detail: 'La contraseña debe tener al menos 5 caracteres', life: 3000 });
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      const rawMessage = error.message?.toLowerCase() || '';
      const message = rawMessage.includes('el email no esta registrado')
        ? 'El correo no está registrado'
        : rawMessage.includes('la contraseña es incorrecta')
        ? 'La contraseña es incorrecta'
        : rawMessage.includes('permisos')
        ? 'No tienes permisos para realizar esta acción'
        : 'No pudimos iniciar sesión. Intenta nuevamente.';
      toast.current?.show({ severity: 'error', summary: 'No se pudo ingresar', detail: message, life: 3500 });
    }
  };

  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <Toast ref={toast} />

      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 shadow-[0_30px_100px_rgba(15,23,42,0.16)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[650px] overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-950/30">
                <i className="pi pi-book" />
              </span>
              <div>
                <p className="text-sm font-extrabold">Biblioteca Digital</p>
                <p className="text-xs text-slate-400">Gestión inteligente y simple</p>
              </div>
            </div>

            <div className="mt-24 max-w-md">
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-300">Bienvenido</p>
              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight">
                Todo tu catálogo,
                <span className="block bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  en un solo lugar.
                </span>
              </h1>
              <p className="mt-5 text-sm leading-7 text-slate-300">
                Consulta libros, administra préstamos y mantén organizada la actividad de la biblioteca desde una interfaz clara.
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {[
              ['pi pi-book', 'Catálogo'],
              ['pi pi-refresh', 'Préstamos'],
              ['pi pi-chart-bar', 'Actividad'],
            ].map(([icon, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-center">
                <i className={`${icon} text-cyan-300`} />
                <p className="mt-2 text-xs font-semibold text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex min-h-[620px] items-center bg-white px-6 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <Link to="/" className="mb-9 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600">
              <i className="pi pi-arrow-left text-xs" /> Volver al inicio
            </Link>

            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 lg:hidden">
                <i className="pi pi-book text-lg" />
              </div>
              <p className="app-eyebrow">Acceso seguro</p>
              <h2 className="app-title">Inicia sesión</h2>
              <p className="app-subtitle">Ingresa tus credenciales para continuar a tu biblioteca.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Correo electrónico</label>
                <span className="p-input-icon-left block w-full">
                  <i className="pi pi-envelope text-slate-400" />
                  <InputText
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full pl-10"
                    autoComplete="email"
                  />
                </span>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">Contraseña</label>
                  <span className="text-xs font-medium text-slate-400">Mínimo 5 caracteres</span>
                </div>
                <Password
                  feedback={false}
                  value={password}
                  toggleMask
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  inputClassName="w-full"
                  className="w-full"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25"
              >
                Ingresar al sistema <i className="pi pi-arrow-right text-xs" />
              </button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">
                ¿Aún no tienes una cuenta?{' '}
                <Link to="/register" className="font-extrabold text-indigo-600 transition hover:text-indigo-700">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
