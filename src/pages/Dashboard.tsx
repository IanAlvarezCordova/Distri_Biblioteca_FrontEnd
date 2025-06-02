// src/pages/Dashboard.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
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

        const updatedDashboardStats = {
          ...dashboardStats,
          librosPorCategoria: dashboardStats.librosPorCategoria.map((c: any) => ({
            categoria_nombre: c.categoria_nombre,
            total: Number(c.total),
          })),
        };

        setStats(updatedDashboardStats);
        setTotalUsuarios(usuarios.length);
        setPrestamosRecientes(
          prestamos
            .filter((p: Prestamo) => new Date(p.fecha_prestamo) >= fiveMonthsAgo)
            .slice(0, 5)
        );
        setDevolucionesRecientes(
          devoluciones
            .filter((d: Devolucion) => new Date(d.fecha_devolucion) >= fiveMonthsAgo)
            .slice(0, 5)
        );

        toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Datos cargados', life: 3000 });
      } catch (err) {
        console.error(err);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar dashboard', life: 3000 });
      }
    };

    fetchData();
  }, []);

  // Gráfico de Pastel: Libros por Categoría
  useEffect(() => {
    if (stats) {
      const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
      if (pieChartRef.current) pieChartRef.current.destroy();

      if (canvas) {
        pieChartRef.current = new Chart(canvas, {
          type: 'pie',
          data: {
            labels: stats.librosPorCategoria.map((c) => c.categoria_nombre),
            datasets: [
              {
                data: stats.librosPorCategoria.map((c) => c.total),
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'right' },
            },
          },
        });
      }
    }
  }, [stats]);

  // Gráfico de barras: Préstamos y Devoluciones Mensuales
  useEffect(() => {
    if (stats && stats.prestamosDevolucionesMensuales?.length > 0) {
      const canvas = document.getElementById('barChart') as HTMLCanvasElement;
      if (barChartRef.current) barChartRef.current.destroy();

      const meses = stats.prestamosDevolucionesMensuales.map((m) =>
        new Date(m.mes + '-01').toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
      );
      const prestamos = stats.prestamosDevolucionesMensuales.map((m) => m.prestamos);
      const devoluciones = stats.prestamosDevolucionesMensuales.map((m) => m.devoluciones);

      if (canvas) {
        barChartRef.current = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: meses,
            datasets: [
              {
                label: 'Préstamos',
                data: prestamos,
                backgroundColor: '#3B82F6',
              },
              {
                label: 'Devoluciones',
                data: devoluciones,
                backgroundColor: '#10B981',
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
                title: {
                  display: true,
                  text: 'Cantidad',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Mes',
                },
              },
            },
          },
        });
      }
    }
  }, [stats]);

  if (!stats) return <div className="p-4">Cargando datos...</div>;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Toast ref={toast} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3>Libros Disponibles</h3>
          <p className="text-2xl font-bold">{stats.librosDisponibles}</p>
        </Card>
        <Card>
          <h3>Total Usuarios</h3>
          <p className="text-2xl font-bold">{totalUsuarios}</p>
        </Card>
        <Card>
          <h3>Préstamos Activos</h3>
          <p className="text-2xl font-bold">{stats.prestamos}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Libros por Categoría</h2>
        <div className="h-80">
          <canvas id="pieChart"></canvas>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Préstamos y Devoluciones Mensuales</h2>
        <div className="h-96">
          <canvas id="barChart"></canvas>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Préstamos Recientes</h2>
        <DataTable value={prestamosRecientes}>
          <Column field="libro.titulo" header="Libro" />
          <Column
            field="usuario"
            header="Usuario"
            body={(row) => `${row.usuario.nombre} ${row.usuario.apellido}`}
          />
          <Column field="fecha_prestamo" header="Fecha" />
        </DataTable>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">Devoluciones Recientes</h2>
        <DataTable value={devolucionesRecientes}>
          <Column field="libro.titulo" header="Libro" />
          <Column
            field="usuario"
            header="Usuario"
            body={(row) => `${row.usuario.nombre} ${row.usuario.apellido}`}
          />
          <Column field="fecha_devolucion" header="Fecha" />
        </DataTable>
      </Card>
    </div>
  );
};

export default Dashboard;
