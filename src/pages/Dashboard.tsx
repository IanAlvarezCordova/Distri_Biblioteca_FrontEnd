// src/pages/Dashboard.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import Chart from 'chart.js/auto';
import { SpeedInsights } from "@vercel/speed-insights/next"
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
  console.log('🏠 Dashboard - Componente inicializándose');
  
  const toast = useRef<Toast>(null);
  const pieChartRef = useRef<Chart | null>(null);
  const barChartRef = useRef<Chart | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [prestamosRecientes, setPrestamosRecientes] = useState<Prestamo[]>([]);
  const [devolucionesRecientes, setDevolucionesRecientes] = useState<Devolucion[]>([]);

  useEffect(() => {
    console.log('🔄 Dashboard - useEffect ejecutándose');
    const fetchData = async () => {
      try {
        console.log('📊 Dashboard - Cargando datos...');
        const dashboardStats = await libroService.getDashboardStats();
        const usuarios = await usuarioService.findAll();
        const prestamos = await prestamoService.findAll();
        const devoluciones = await devolucionService.findAll();
        
        console.log('✅ Dashboard - Datos cargados:', {
          stats: dashboardStats,
          usuarios: usuarios.length,
          prestamos: prestamos.length,
          devoluciones: devoluciones.length
        });

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
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                display: true,
                position: 'bottom'
              },
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
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                display: false
              },
            },
            scales: {
              y: {
                display: false,
                beginAtZero: true,
              },
              x: {
                display: false,
              },
            },
          },
        });
      }
    }
  }, [stats]);

  if (!stats) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <i className="pi pi-spin pi-spinner text-4xl text-blue-600 mb-4"></i>
        <p className="text-lg text-gray-600">Cargando datos del dashboard...</p>
      </div>
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const userBodyTemplate = (rowData: any) => {
    return `${rowData.usuario.nombre} ${rowData.usuario.apellido}`;
  };

  const bookBodyTemplate = (rowData: any) => {
    return rowData.libro.titulo;
  };

  const dateBodyTemplate = (rowData: any, field: string) => {
    const date = field === 'fecha_prestamo' ? rowData.fecha_prestamo : rowData.fecha_devolucion;
    return formatDate(date);
  };

  return (
    <div className="p-6">
      <Toast ref={toast} />
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Card>
          <div className="flex items-center justify-between p-2">
            <div>
              <h3 className="text-xs text-gray-600">Libros Disponibles</h3>
              <p className="text-lg font-bold text-green-600">{stats.librosDisponibles}</p>
            </div>
            <i className="pi pi-book text-green-600 text-sm"></i>
          </div>
        </Card>
        
        <SpeedInsights/>
        
        <Card>
          <div className="flex items-center justify-between p-2">
            <div>
              <h3 className="text-xs text-gray-600">Total Usuarios</h3>
              <p className="text-lg font-bold text-blue-600">{totalUsuarios}</p>
            </div>
            <i className="pi pi-users text-blue-600 text-sm"></i>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between p-2">
            <div>
              <h3 className="text-xs text-gray-600">Préstamos</h3>
              <p className="text-lg font-bold text-orange-600">{stats.prestamos}</p>
            </div>
            <i className="pi pi-clock text-orange-600 text-sm"></i>
          </div>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-3">
        <Card>
          <h2 className="text-xs font-medium mb-1 text-gray-500">Libros por Categoría</h2>
          <div className="h-6">
            <canvas id="pieChart"></canvas>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-xs font-medium mb-1 text-gray-500">Préstamos y Devoluciones</h2>
          <div className="h-6">
            <canvas id="barChart"></canvas>
          </div>
        </Card>
      </div>
      
      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Préstamos Recientes</h2>
          <DataTable value={prestamosRecientes} size="small">
            <Column field="libro.titulo" header="Libro" body={bookBodyTemplate} />
            <Column field="usuario" header="Usuario" body={userBodyTemplate} />
            <Column field="fecha_prestamo" header="Fecha" body={(rowData) => dateBodyTemplate(rowData, 'fecha_prestamo')} />
          </DataTable>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold mb-4">Devoluciones Recientes</h2>
          <DataTable value={devolucionesRecientes} size="small">
            <Column field="libro.titulo" header="Libro" body={bookBodyTemplate} />
            <Column field="usuario" header="Usuario" body={userBodyTemplate} />
            <Column field="fecha_devolucion" header="Fecha" body={(rowData) => dateBodyTemplate(rowData, 'fecha_devolucion')} />
          </DataTable>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
