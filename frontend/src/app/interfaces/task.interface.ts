export interface Task {
    id: number;                 // ID único de la tarea
    title: string;             // Título de la tarea
    description: string;       // Descripción detallada
    category: TaskCategory;    // Categoría de la tarea
    location: string;          // Ubicación donde se realizará
    budget: {
        amount: number;        // Cantidad del presupuesto
        currency: string;      // Tipo de moneda (EUR, USD, etc.)
    };
    status: TaskStatus;        // Estado de la tarea
    dateCreated: Date;        // Fecha de creación
    dateNeeded: Date;         // Fecha para cuando se necesita
    author: {
        id: number;           // ID del autor
        name: string;         // Nombre del autor
        rating: number;       // Valoración del autor
    };
    requirements?: string[];   // Requisitos específicos (opcional)
    attachments?: string[];    // URLs de archivos adjuntos (opcional)
    urgency: TaskUrgency;     // Nivel de urgencia
    views: number;            // Número de veces que se ha visto la tarea
    applications: number;      // Número de personas que se han postulado
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