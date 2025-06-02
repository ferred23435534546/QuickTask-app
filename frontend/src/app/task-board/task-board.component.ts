// src/app/task-board/task-board.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para cosas como *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; // Necesario para el two-way data binding y formularios basados en plantillas

// Define una interfaz para la estructura de los datos de una Tarea
interface Tarea {
    id: string; // Añadimos el ID aquí para poder enviarlo al backend
    nombre: string;
    descripcion: string;
    fechaLimite: string;
}

@Component({
    selector: 'app-task-board', // Esta es la etiqueta HTML que usarías en tus plantillas: <app-task-board></app-task-board>
    standalone: true, // Márcalo como standalone si usas Angular 15+ y quieres usarlo directamente
    imports: [CommonModule, FormsModule], // Importa los módulos de Angular necesarios para las características de la plantilla
    templateUrl: './task-board.component.html', // Apunta a tu archivo HTML
    styleUrls: ['./task-board.component.scss'] // Apunta a tu archivo SCSS
})
export class TaskBoardComponent implements OnInit { // Exporta la clase para que app-routing.module.ts pueda importarla

    // Propiedades del componente (estas reemplazarán tus llamadas a document.getElementById)
    tareaNombre: string = ''; // Cambiado de tareaId a tareaNombre
    tareaEncontrada: Tarea | null = null; // Para almacenar la información de la tarea
    puntuacion: number | null = null;
    comentarios: string = '';
    aspectosSeleccionados: string[] = []; // Para las casillas de verificación
    mensajeValoracion: string = '';
    esExitoMensaje: boolean = true;
    errorTareaNombre: string = ''; // Cambiado de errorTareaId a errorTareaNombre
    errorPuntuacion: string = '';

    // Simula los datos de la tarea (en una aplicación real, esto provendría de un servicio)
    // Ahora las tareas simuladas incluyen un ID para cada una.
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

    constructor() { }

    ngOnInit(): void {
        // La lógica de inicialización puede ir aquí si es necesario.
    }

    // --- Métodos del Componente ---

    buscarTarea(): void {
        this.errorTareaNombre = ''; // Limpia el error anterior
        this.tareaEncontrada = null; // Limpia la información de la tarea anterior

        const nombreBuscado = this.tareaNombre.trim().toLowerCase(); // Convertir a minúsculas para búsqueda insensible a mayúsculas/minúsculas
        if (nombreBuscado) {
            // Busca la tarea por nombre
            const tarea = this.tareasSimuladas.find(t => t.nombre.toLowerCase().includes(nombreBuscado));
            
            if (tarea) {
                this.tareaEncontrada = tarea;
            } else {
                this.errorTareaNombre = 'Tarea no encontrada. Introduce el nombre completo o parte de él.';
            }
        } else {
            this.errorTareaNombre = 'Por favor, introduce el nombre de la tarea para buscar.';
        }
    }

    onCheckboxChange(event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
            this.aspectosSeleccionados.push(checkbox.value);
        } else {
            this.aspectosSeleccionados = this.aspectosSeleccionados.filter(aspecto => aspecto !== checkbox.value);
        }
        // Elimina duplicados si los hay (por ejemplo, si se vuelve a agregar con un estado de evento diferente)
        this.aspectosSeleccionados = [...new Set(this.aspectosSeleccionados)];
    }


    async enviarValoracion(): Promise<void> {
        this.mensajeValoracion = ''; // Limpia mensajes anteriores
        this.errorTareaNombre = ''; // Limpia el error del nombre de la tarea
        this.errorPuntuacion = '';

        let isValid = true;

        // Validar que se ha encontrado una tarea
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

        // Datos a enviar al backend
        const datosValoracion = {
            // Enviamos el ID de la tarea encontrada, que es lo más común para identificarla en el backend
            'tareaId': this.tareaEncontrada?.id, // Usamos el ID de la tarea encontrada
            'tareaNombre': this.tareaEncontrada?.nombre, // También enviamos el nombre para referencia
            puntuacion: this.puntuacion,
            comentarios: this.comentarios,
            aspectos: this.aspectosSeleccionados
        };

        console.log('Datos del formulario a enviar:', datosValoracion);

        const API_URL = 'http://localhost:8080/api/valorar-tarea'; // ¡ADAPTA ESTA URL A TU BACKEND EN DOCKER!

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosValoracion)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Error desconocido en el servidor.' }));
                throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
            }

            const result = await response.json();
            console.log('Respuesta exitosa del servidor:', result);

            this.mostrarMensaje('¡Valoración enviada con éxito!', true);
            this.resetForm(); // Llama a un método para restablecer el formulario

        } catch (error: any) {
            console.error('Error al enviar la valoración:', error);
            this.mostrarMensaje(`Error al enviar valoración: ${error.message}.`, false);
        }
    }

    // Método auxiliar para mostrar mensajes (ahora parte del componente)
    private mostrarMensaje(mensaje: string, esExito: boolean): void {
        this.mensajeValoracion = mensaje;
        this.esExitoMensaje = esExito;
        setTimeout(() => {
            this.mensajeValoracion = '';
        }, 5000);
    }

    // Método auxiliar para restablecer el estado del formulario
    private resetForm(): void {
        this.tareaNombre = ''; // Reseteamos el nombre de la tarea
        this.tareaEncontrada = null;
        this.puntuacion = null;
        this.comentarios = '';
        this.aspectosSeleccionados = [];
        this.errorTareaNombre = ''; // Reseteamos el error del nombre de la tarea
        this.errorPuntuacion = '';
    }
}