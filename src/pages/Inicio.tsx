import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Inicio: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <main className="auth-shell min-h-screen px-5 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-12 lg:grid-cols-2">
        <section className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700">
            <i className="pi pi-book" /> Sistema de Gestión Bibliotecaria
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Tu biblioteca,<span className="block text-orange-500">más simple de gestionar.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
            Administra libros, préstamos, devoluciones, autores y usuarios desde una experiencia clara, rápida y centralizada.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isAuthenticated ? (
              <Link to="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">Ir al Dashboard <i className="pi pi-arrow-right" /></Link>
            ) : (
              <>
                <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">Iniciar sesión <i className="pi pi-arrow-right" /></Link>
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">Crear cuenta</Link>
              </>
            )}
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3 text-center">
            {[['Catálogo','organizado'],['Préstamos','controlados'],['Actividad','centralizada']].map(([title, subtitle]) => (
              <div key={title} className="rounded-2xl border border-white/70 bg-white/70 p-3 shadow-sm backdrop-blur">
                <p className="text-sm font-bold text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-500">{subtitle}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative hidden lg:block">
          <div className="app-surface relative overflow-hidden p-10">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50"><img src={logo} alt="Logo de Biblioteca Digital" className="h-12 w-12 object-contain" /></div>
              <div><p className="text-sm font-medium text-orange-500">Biblioteca Digital</p><h2 className="text-2xl font-bold text-slate-900">Gestión clara y eficiente</h2></div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[['pi pi-book','Libros','Catálogo y disponibilidad'],['pi pi-arrow-right','Préstamos','Seguimiento sencillo'],['pi pi-users','Usuarios','Roles y perfiles'],['pi pi-chart-bar','Dashboard','Indicadores de actividad']].map(([icon,title,text]) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm"><i className={icon} /></div>
                  <p className="font-semibold text-slate-800">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
export default Inicio;
