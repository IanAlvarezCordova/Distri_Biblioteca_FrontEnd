import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import Chart from 'chart.js/auto';
import { libroService } from '../services/libroService';
import { prestamoService } from '../services/prestamoService';
import { devolucionService } from '../services/devolucionService';
import { usuarioService } from '../services/usuarioService';

interface DashboardStats {
  librosDisponibles: number;
  prestamos: number;
  devoluciones: number;
  librosPorCategoria: { categoria_nombre: string; total: number }[];
  prestamosDevolucionesMensuales: {
    mes: string;
    prestamos: number;
    devoluciones: number;
  }[];
}

interface Prestamo {
  id: number;
  fecha_prestamo: string;
  libro: { titulo: string };
  usuario: { nombre: string; apellido: string };
}

interface Devolucion {
  id: number;
  fecha_devolucion: string;
  libro: { titulo: string };
  usuario: { nombre: string; apellido: string };
}

const Dashboard: React.FC = () => {
  const toast = useRef<Toast>(null);
  const pieChartRef = useRef<Chart | null>(null);
  const barChartRef = useRef<Chart | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [prestamosRecientes, setPrestamosRecientes] = useState<Prestamo[]>([]);
  const [devolucionesRecientes, setDevolucionesRecientes] = useState<Devolucion[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardStats = await libroService.getDashboardStats();
        const usuarios = await usuarioService.findAll();
        const prestamos = await prestamoService.findAll();
        const devoluciones = await devolucionService.findAll();

        const today = new Date();
        const fiveMonthsAgo = new Date(today);
        fiveMonthsAgo.setMonth(today.getMonth() - 5);

        setStats({
          ...dashboardStats,
          librosPorCategoria: dashboardStats.librosPorCategoria.map((item: any) => ({
            categoria_nombre: item.categoria_nombre,
            total: Number(item.total),
          })),
        });
        setTotalUsuarios(usuarios.length);
        setPrestamosRecientes(
          prestamos
            .filter((item: Prestamo) => new Date(item.fecha_prestamo) >= fiveMonthsAgo)
            .slice(0, 5),
        );
        setDevolucionesRecientes(
          devoluciones
            .filter((item: Devolucion) => new Date(item.fecha_devolucion) >= fiveMonthsAgo)
            .slice(0, 5),
        );
      } catch (error) {
        console.error(error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el dashboard',
          life: 3000,
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!stats || stats.librosPorCategoria.length === 0) return;

    const canvas = document.getElementById('categoryChart') as HTMLCanvasElement | null;
    if (!canvas) return;

    pieChartRef.current?.destroy();
    pieChartRef.current = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: stats.librosPorCategoria.map((item) => item.categoria_nombre),
        datasets: [
          {
            data: stats.librosPorCategoria.map((item) => item.total),
            backgroundColor: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
            borderWidth: 0,
            hoverOffset: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 18,
              color: '#64748b',
              font: { size: 11, weight: 600 },
            },
          },
        },
      },
    });

    return () => pieChartRef.current?.destroy();
  }, [stats]);

  useEffect(() => {
    if (!stats || !stats.prestamosDevolucionesMensuales?.length) return;

    const canvas = document.getElementById('activityChart') as HTMLCanvasElement | null;
    if (!canvas) return;

    barChartRef.current?.destroy();

    const labels = stats.prestamosDevolucionesMensuales.map((item) =>
      new Date(item.mes + '-01').toLocaleDateString('es-ES', { month: 'short' }),
    );

    barChartRef.current = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Préstamos',
            data: stats.prestamosDevolucionesMensuales.map((item) => item.prestamos),
            backgroundColor: '#4f46e5',
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Devoluciones',
            data: stats.prestamosDevolucionesMensuales.map((item) => item.devoluciones),
            backgroundColor: '#06b6d4',
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 8,
              boxHeight: 8,
              color: '#64748b',
              font: { size: 11, weight: 600 },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { color: '#94a3b8', font: { size: 11 } },
          },
          y: {
            beginAtZero: true,
            border: { display: false },
            grid: { color: '#eef2f7' },
            ticks: { color: '#94a3b8', precision: 0, font: { size: 11 } },
          },
        },
      },
    });

    return () => barChartRef.current?.destroy();
  }, [stats]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  if (!stats) {
    return (
      <div className="app-page flex min-h-[65vh] items-center justify-center">
        <div className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <i className="pi pi-spin pi-spinner text-xl" />
          </span>
          <p className="mt-4 text-sm font-bold text-slate-700">Cargando dashboard</p>
          <p className="mt-1 text-xs text-slate-400">Estamos preparando la información.</p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Libros disponibles',
      value: stats.librosDisponibles,
      icon: 'pi pi-book',
      color: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      accent: 'from-emerald-500 to-teal-400',
    },
    {
      label: 'Usuarios',
      value: totalUsuarios,
      icon: 'pi pi-users',
      color: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      accent: 'from-indigo-500 to-violet-500',
    },
    {
      label: 'Préstamos',
      value: stats.prestamos,
      icon: 'pi pi-arrow-up-right',
      color: 'text-amber-600',
      iconBg: 'bg-amber-50',
      accent: 'from-amber-400 to-orange-500',
    },
    {
      label: 'Devoluciones',
      value: stats.devoluciones,
      icon: 'pi pi-arrow-down-left',
      color: 'text-cyan-600',
      iconBg: 'bg-cyan-50',
      accent: 'from-cyan-500 to-sky-500',
    },
  ];

  return (
    <div className="app-page animate-app-in">
      <Toast ref={toast} />

      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="app-eyebrow">Resumen general</p>
          <h1 className="app-title">Actividad de la biblioteca</h1>
          <p className="app-subtitle">Consulta indicadores, distribución del catálogo y movimientos recientes.</p>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Sistema operativo
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <article key={item.label} className="app-card relative overflow-hidden p-5">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500">{item.label}</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">{item.value}</p>
              </div>
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.iconBg} ${item.color}`}>
                <i className={item.icon} />
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="app-card p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-sm font-extrabold text-slate-900">Libros por categoría</p>
              <p className="mt-1 text-xs text-slate-500">Distribución actual del catálogo</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <i className="pi pi-chart-pie text-sm" />
            </span>
          </div>
          <div className="h-72">
            {stats.librosPorCategoria.length > 0 ? (
              <canvas id="categoryChart" />
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70">
                <div className="text-center">
                  <i className="pi pi-chart-pie text-xl text-slate-300" />
                  <p className="mt-2 text-xs font-semibold text-slate-400">Aún no hay libros por categoría</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="app-card p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="text-sm font-extrabold text-slate-900">Actividad mensual</p>
              <p className="mt-1 text-xs text-slate-500">Préstamos frente a devoluciones</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <i className="pi pi-chart-bar text-sm" />
            </span>
          </div>
          <div className="h-72">
            {stats.prestamosDevolucionesMensuales?.length > 0 ? (
              <canvas id="activityChart" />
            ) : (
              <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70">
                <div className="text-center">
                  <i className="pi pi-chart-bar text-xl text-slate-300" />
                  <p className="mt-2 text-xs font-semibold text-slate-400">Aún no hay actividad mensual</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="app-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <p className="text-sm font-extrabold text-slate-900">Préstamos recientes</p>
              <p className="mt-1 text-xs text-slate-500">Últimos movimientos registrados</p>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-extrabold text-amber-700">
              {prestamosRecientes.length} registros
            </span>
          </div>
          {prestamosRecientes.length > 0 ? (
            <DataTable value={prestamosRecientes} size="small" className="border-0">
              <Column field="libro.titulo" header="Libro" body={(rowData) => rowData.libro.titulo} />
              <Column field="usuario" header="Usuario" body={(rowData) => `${rowData.usuario.nombre} ${rowData.usuario.apellido}`} />
              <Column field="fecha_prestamo" header="Fecha" body={(rowData) => formatDate(rowData.fecha_prestamo)} />
            </DataTable>
          ) : (
            <div className="px-6 py-10 text-center text-sm text-slate-400">No hay préstamos recientes.</div>
          )}
        </section>

        <section className="app-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <p className="text-sm font-extrabold text-slate-900">Devoluciones recientes</p>
              <p className="mt-1 text-xs text-slate-500">Últimos libros recibidos</p>
            </div>
            <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-extrabold text-cyan-700">
              {devolucionesRecientes.length} registros
            </span>
          </div>
          {devolucionesRecientes.length > 0 ? (
            <DataTable value={devolucionesRecientes} size="small" className="border-0">
              <Column field="libro.titulo" header="Libro" body={(rowData) => rowData.libro.titulo} />
              <Column field="usuario" header="Usuario" body={(rowData) => `${rowData.usuario.nombre} ${rowData.usuario.apellido}`} />
              <Column field="fecha_devolucion" header="Fecha" body={(rowData) => formatDate(rowData.fecha_devolucion)} />
            </DataTable>
          ) : (
            <div className="px-6 py-10 text-center text-sm text-slate-400">No hay devoluciones recientes.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
