export interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    budget?: number;
    createdAt: Date;
    status: 'open' | 'in-progress' | 'completed';
    userId: string;
}

// Enums para las propiedades que tienen valores específicos
export enum TaskCategory {
    Limpieza = 'cleaning',
    Jardineria = 'gardening',
    Entrega = 'delivery',
    Mudanza = 'moving',
    Traduccion = 'translation',
    Otros = 'other'
}

export enum TaskStatus {
    Publicada = 'published',      // Tarea recién publicada
    EnProceso = 'in_progress',    // Alguien está trabajando en ella
    Completada = 'completed',     // Tarea finalizada
    Cancelada = 'cancelled',      // Tarea cancelada
    Expirada = 'expired'         // Pasó la fecha límite
}

export enum TaskUrgency {
    Baja = 'low',
    Media = 'medium',
    Alta = 'high',
    Inmediata = 'immediate'
}

// Interfaz para la respuesta paginada de tareas
export interface TasksResponse {
    tasks: Task[];              // Array de tareas
    totalCount: number;         // Total de tareas disponibles
    currentPage: number;        // Página actual
    totalPages: number;         // Total de páginas
    hasNextPage: boolean;       // Si hay más páginas disponibles
    hasPreviousPage: boolean;   // Si hay páginas anteriores
} 