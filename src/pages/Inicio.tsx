import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Inicio: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: 'pi pi-book',
      title: 'Catálogo organizado',
      text: 'Gestiona libros, autores y categorías desde un mismo espacio.',
      accent: 'from-indigo-500 to-violet-500',
    },
    {
      icon: 'pi pi-refresh',
      title: 'Préstamos y devoluciones',
      text: 'Controla movimientos y disponibilidad sin perder el contexto.',
      accent: 'from-cyan-500 to-sky-500',
    },
    {
      icon: 'pi pi-chart-bar',
      title: 'Información útil',
      text: 'Consulta indicadores y actividad reciente desde el dashboard.',
      accent: 'from-amber-400 to-orange-500',
    },
  ];

  return (
    <main className="auth-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15">
              <i className="pi pi-book" />
            </span>
            <div>
              <p className="text-sm font-extrabold tracking-tight text-slate-900">Biblioteca Digital</p>
              <p className="text-xs font-medium text-slate-500">Sistema de gestión</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAuthenticated && (
              <Link
                to="/login"
                className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-white/70 hover:text-indigo-600 sm:inline-flex"
              >
                Iniciar sesión
              </Link>
            )}
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              {isAuthenticated ? 'Ir al dashboard' : 'Crear cuenta'}
              <i className="pi pi-arrow-right text-xs" />
            </Link>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/70 px-3.5 py-2 text-xs font-extrabold text-indigo-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Tu biblioteca, mejor organizada
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
              Gestiona mejor.
              <span className="mt-2 block bg-gradient-to-r from-indigo-600 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                Encuentra más rápido.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Una experiencia simple para administrar libros, préstamos, devoluciones, autores y usuarios sin perder tiempo entre pantallas.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to={isAuthenticated ? '/dashboard' : '/login'}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-indigo-500/20 transition hover:-translate-y-0.5"
              >
                {isAuthenticated ? 'Abrir dashboard' : 'Comenzar ahora'}
                <i className="pi pi-arrow-right text-xs" />
              </Link>

              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-6 py-3.5 text-sm font-extrabold text-slate-700 shadow-sm backdrop-blur transition hover:border-indigo-200 hover:text-indigo-600"
                >
                  Crear una cuenta
                </Link>
              )}
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-2"><i className="pi pi-check-circle text-emerald-500" /> Catálogo centralizado</span>
              <span className="inline-flex items-center gap-2"><i className="pi pi-check-circle text-emerald-500" /> Roles de usuario</span>
              <span className="inline-flex items-center gap-2"><i className="pi pi-check-circle text-emerald-500" /> Dashboard de actividad</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-12 h-44 w-44 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="absolute -bottom-8 right-4 h-48 w-48 rounded-full bg-cyan-300/25 blur-3xl" />

            <div className="app-card relative overflow-hidden p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-500">Vista general</p>
                  <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">Tu espacio de trabajo</h2>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <i className="pi pi-th-large" />
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature.title} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.accent} text-white shadow-sm`}>
                      <i className={feature.icon} />
                    </span>
                    <h3 className="mt-4 text-sm font-extrabold text-slate-900">{feature.title}</h3>
                    <p className="mt-1.5 text-xs leading-5 text-slate-500">{feature.text}</p>
                  </div>
                ))}

                <div className="rounded-2xl bg-slate-950 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                      <i className="pi pi-shield" />
                    </span>
                    <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-extrabold text-emerald-300">Seguro</span>
                  </div>
                  <h3 className="mt-4 text-sm font-extrabold">Acceso por roles</h3>
                  <p className="mt-1.5 text-xs leading-5 text-slate-400">
                    Mantén separadas las acciones de usuarios finales y administradores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Inicio;
