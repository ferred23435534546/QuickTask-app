import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, of } from 'rxjs'; // Importar catchError y of para manejar errores de observables

// Define una interfaz para la estructura de los datos de una Tarea
interface Tarea {
    id: string; // Este podría ser el job_id o un id de tarea de tu DB
    nombre: string; // Este sería el nombre de la tarea en tu DB
    descripcion: string;
    fechaLimite: string;
}

@Component({
    selector: 'app-task-board',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './task-board.component.html',
    styleUrls: ['./task-board.component.scss']
})
export class TaskBoardComponent implements OnInit {

    tareaNombre: string = '';
    tareaEncontrada: Tarea | null = null;
    puntuacion: number | null = null;
    comentarios: string = '';
    aspectosSeleccionados: string[] = [];
    mensajeValoracion: string = '';
    esExitoMensaje: boolean = true;
    errorTareaNombre: string = '';
    errorPuntuacion: string = '';

    // Las tareas simuladas ya no son necesarias para la búsqueda,
    // pero las dejamos por si las usas en otra parte de tu aplicación
    private tareasSimuladas: Tarea[] = [
        {
            id: 'T001',
            nombre: 'Desarrollar módulo de usuarios',
            descripcion: 'Crear funcionalidades de registro, login y gestión de perfiles.',
            fechaLimite: '2025-07-15'
        },
        {
            id: 'T002',
            nombre: 'Diseñar interfaz de tareas',
            descripcion: 'Maquetación y estilos CSS para la visualización de tareas.',
            fechaLimite: '2025-06-30'
        },
        {
            id: 'T003',
            nombre: 'Optimizar consultas a la base de datos',
            descripcion: 'Revisión y mejora de rendimiento en las consultas SQL.',
            fechaLimite: '2025-08-01'
        }
    ];

    constructor(private http: HttpClient) { }

    ngOnInit(): void { }

    // --- Métodos del Componente ---

    buscarTarea(): void {
        this.errorTareaNombre = '';
        this.tareaEncontrada = null;

        const nombreBuscado = this.tareaNombre.trim(); // No es necesario toLowerCase() aquí si el backend busca insensible a mayúsculas/minúsculas
        if (!nombreBuscado) {
            this.errorTareaNombre = 'Por favor, introduce el nombre de la tarea para buscar.';
            return;
        }

        // URL para buscar tareas por nombre en tu backend
        // **IMPORTANTE**: Ajusta esta URL para que apunte al endpoint de tu backend
        // que busca tareas en la tabla 'tasks'.
        // Por ejemplo, si tu backend tiene una ruta GET /api/tasks?name=nombreTarea
        const API_BUSCAR_TAREA_URL = `http://localhost:8080/api/task?nombre=${encodeURIComponent(nombreBuscado)}`;

        this.http.get<Tarea[]>(API_BUSCAR_TAREA_URL).pipe(
            catchError(error => {
                console.error('Error al buscar la tarea:', error);
                this.errorTareaNombre = 'Error al buscar la tarea. Inténtalo de nuevo más tarde.';
                return of([]); // Retorna un observable vacío para que la suscripción no falle
            })
        ).subscribe(
            (tareas: Tarea[]) => {
                if (tareas && tareas.length > 0) {
                    // Si el backend devuelve un array, toma la primera coincidencia
                    this.tareaEncontrada = tareas[0];
                    console.log('Tarea encontrada:', this.tareaEncontrada);
                } else {
                    this.errorTareaNombre = 'Tarea no encontrada. Verifica el nombre o prueba con otro.';
                }
            }
        );
    }

    onCheckboxChange(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.aspectosSeleccionados.push(checkbox.value);
        } else {
            this.aspectosSeleccionados = this.aspectosSeleccionados.filter(aspecto => aspecto !== checkbox.value);
        }
        this.aspectosSeleccionados = [...new Set(this.aspectosSeleccionados)];
    }

    async enviarValoracion(): Promise<void> {
        this.mensajeValoracion = '';
        this.errorTareaNombre = '';
        this.errorPuntuacion = '';

        let isValid = true;

        if (!this.tareaEncontrada) {
            this.errorTareaNombre = 'Por favor, busca y selecciona una tarea válida antes de enviar.';
            isValid = false;
        }

        if (this.puntuacion === null || this.puntuacion < 1 || this.puntuacion > 5) {
            this.errorPuntuacion = 'Por favor, selecciona una puntuación.';
            isValid = false;
        }

        if (!isValid) {
            console.log('Validación fallida. El formulario no se enviará.');
            return;
        }

        const datosValoracion = {
            'tareaId': this.tareaEncontrada?.id,
            'tareaNombre': this.tareaEncontrada?.nombre,
            puntuacion: this.puntuacion,
            comentarios: this.comentarios,
            aspectos: this.aspectosSeleccionados
        };

        console.log('Datos del formulario a enviar:', datosValoracion);

        const API_URL = 'http://localhost:8080/api/ratings';

        try {
            this.http.post(API_URL, datosValoracion).subscribe({
                next: (response) => {
                    console.log('Respuesta exitosa del servidor:', response);
                    this.mostrarMensaje('¡Valoración enviada con éxito!', true);
                    this.resetForm();
                },
                error: (error) => {
                    console.error('Error al enviar la valoración:', error);
                    const errorMessage = error.error && error.error.message ? error.error.message : 'Error desconocido.';
                    this.mostrarMensaje(`Error al enviar valoración: ${errorMessage}`, false);
                }
            });

        } catch (error: any) {
            console.error('Error al enviar la valoración (catch global):', error);
            this.mostrarMensaje(`Error al enviar valoración: ${error.message}.`, false);
        }
    }

    private mostrarMensaje(mensaje: string, esExito: boolean): void {
        this.mensajeValoracion = mensaje;
        this.esExitoMensaje = esExito;
        setTimeout(() => {
            this.mensajeValoracion = '';
        }, 5000);
    }

    private resetForm(): void {
        this.tareaNombre = '';
        this.tareaEncontrada = null;
        this.puntuacion = null;
        this.comentarios = '';
        this.aspectosSeleccionados = [];
        this.errorTareaNombre = '';
        this.errorPuntuacion = '';
    }
}