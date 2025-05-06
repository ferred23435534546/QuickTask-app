"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/server.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// Carga las variables de entorno desde .env
dotenv_1.default.config();
const app = (0, express_1.default)();
// Usa el puerto definido en .env o 3000 por defecto
const port = process.env.PORT || 3000;
// Middleware para parsear JSON en las peticiones
app.use(express_1.default.json());
// Ruta de prueba simple
app.get('/', (req, res) => {
    res.send('¡Hola desde el Backend de QuickTask!');
});
// Iniciar el servidor
app.listen(port, () => {
    // Mensaje para saber que el servidor arrancó (se verá en los logs de Docker)
    console.log(`Servidor backend escuchando en el puerto ${port}`);
});
