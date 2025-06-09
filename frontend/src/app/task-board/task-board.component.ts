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
    presupuesto: number;
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

    // Tareas simuladas para la búsqueda en frontend
    private tareasSimuladas: Tarea[] = [
        {
            id: 'T001',
            nombre: 'Desarrollar módulo de usuarios',
            descripcion: 'Crear funcionalidades de registro, login y gestión de perfiles.',
            fechaLimite: '2025-07-15',
            presupuesto: 50
        },
        {
            id: 'T002',
            nombre: 'Limpieza instituo',
            descripcion: 'Limpieza de instituto en el centro de almeria',
            fechaLimite: '2025-06-08',
            presupuesto: 50
        },
        {
            id: 'T003', // Nueva tarea, si es la que buscas como "mudanza"
            nombre: 'Mudanza', // Asegúrate de que el nombre coincida exactamente con lo que buscarás
            descripcion: 'Busco ayudante para mudanza dos días de la semana del 2 al 6 de Junio. Se requiere que sea una persona capaz de cargar peso, y que sea amable',
            fechaLimite: '2025-06-02',
            presupuesto: 100
        }
        // Puedes añadir más tareas aquí si necesitas simular otras
    ];

    constructor(private http: HttpClient) { }

    ngOnInit(): void { }

    // --- Métodos del Componente ---

    buscarTarea(): void {
        this.errorTareaNombre = '';
        this.tareaEncontrada = null;

        const nombreBuscado = this.tareaNombre.trim().toLowerCase(); // Convertir a minúsculas para búsqueda insensible
        if (!nombreBuscado) {
            this.errorTareaNombre = 'Por favor, introduce el nombre de la tarea para buscar.';
            return;
        }

        // --- INICIO: SIMULACIÓN DE BÚSQUEDA EN FRONTEND ---
        console.log(`Simulando búsqueda de tarea: "${nombreBuscado}"`);
        const tareaCoincidente = this.tareasSimuladas.find(
            tarea => tarea.nombre.toLowerCase() === nombreBuscado
        );

        if (tareaCoincidente) {
            this.tareaEncontrada = tareaCoincidente;
            console.log('Tarea encontrada simulada:', this.tareaEncontrada);
        } else {
            this.errorTareaNombre = 'Tarea no encontrada en la lista simulada. Verifica el nombre o prueba con otro.';
        }
        return; // Sal del método, no realices la llamada HTTP al backend para la búsqueda
        // --- FIN: SIMULACIÓN DE BÚSQUEDA EN FRONTEND ---


        // --- BLOQUE ORIGINAL (COMENTADO): LLAMADA REAL AL BACKEND PARA BÚSQUEDA ---
        /*
        const API_BUSCAR_TAREA_URL = `http://localhost:8080/api/tasks?nombre=${encodeURIComponent(this.tareaNombre.trim())}`;

        this.http.get<Tarea[]>(API_BUSCAR_TAREA_URL).pipe(
            catchError(error => {
                console.error('Error al buscar la tarea en el backend:', error);
                this.errorTareaNombre = 'Error al buscar la tarea. Inténtalo de nuevo más tarde.';
                return of([]);
            })
        ).subscribe(
            (tareas: Tarea[]) => {
                if (tareas && tareas.length > 0) {
                    this.tareaEncontrada = tareas[0];
                    console.log('Tarea encontrada del backend:', this.tareaEncontrada);
                } else {
                    this.errorTareaNombre = 'Tarea no encontrada en el backend. Verifica el nombre o prueba con otro.';
                }
            }
        );
        */
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

        // --- INICIO: SIMULACIÓN TEMPORAL DE RESPUESTA EXITOSA PARA EL ENVÍO ---
        // ¡IMPORTANTE! Comenta o elimina estas líneas cuando tu backend esté listo para recibir datos.
        console.log('Simulando envío de valoración...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula un retraso de red
        this.mostrarMensaje('¡Valoración enviada con éxito!', true);
        this.resetForm();
        return; // Sal del método para evitar la llamada HTTP real por ahora
        // --- FIN: SIMULACIÓN TEMPORAL ---


        // --- BLOQUE ORIGINAL (COMENTADO): CÓDIGO PARA ENVÍO REAL AL BACKEND ---
        /*
        try {
            this.http.post(API_URL, datosValoracion).subscribe({
                next: (response) => {
                    console.log('Respuesta exitosa del servidor:', response);
                    this.mostrarMensaje('¡Valoración enviada con éxito!', true);
                    this.resetForm();
                },
                error: (error) => {
                    console.error('Error al enviar la valoración al backend:', error);
                    const errorMessage = error.error && error.error.message ? error.error.message : 'Error desconocido.';
                    this.mostrarMensaje(`Error al enviar valoración: ${errorMessage}`, false);
                }
            });

        } catch (error: any) {
            console.error('Error al enviar la valoración (catch global):', error);
            this.mostrarMensaje(`Error al enviar valoración: ${error.message}.`, false);
        }
        */
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