"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/server.ts
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
// Importa la conexión Sequelize (sin cambios)
const database_1 = require("./config/database");
// Importa el Modelo User (¡esta forma es correcta!)
const User_1 = __importDefault(require("./models/User"));
// dotenv.config(); // No es necesario si ya se carga en database.ts
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
// --- OPCIONES DE CORS ---
// Permitir solicitudes solo desde el origen de tu frontend Angular
const corsOptions = {
    origin: 'http://localhost:8080', // La URL donde corre tu frontend Angular
    optionsSuccessStatus: 200 // Para algunos navegadores antiguos
};
// --- Middlewares ---
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// --- Rutas ---
app.get('/api', (req, res) => {
    res.send('¡Hola desde el Backend de QuickTask!');
});
// --- Rutas de Autenticación ---
// POST /api/auth/register
app.post('/api/auth/register', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('BACKEND (/api/auth/register): req.body recibido:', req.body);
    const { email, password, name, role } = req.body; // Añadido name y role si quieres registrarlos también
    console.log(`BACKEND (/api/auth/register): Datos extraídos -> Email: ${email}, Password (plano): '${password}', Name: ${name}, Role: ${role}`);
    // Validación (mejorada un poco)
    if (!email || !password || !name) { // Añadido name como requerido
        return res.status(400).json({ message: 'Name, Email and password are required.' });
    }
    // Podrías añadir validación para 'role' si lo recibes
    try {
        // --- PASO 1: Obtener datos del cuerpo ---
        const { email, password, name, role } = req.body;
        // --- PASO 2: Validación (AHORA tiene acceso a las variables) ---
        if (!email || !password || !name) { // Validación movida aquí
            return res.status(400).json({ message: 'Name, Email and password are required.' });
        }
        // Podrías añadir validación para 'role' si lo recibes
        // --- PASO 3: Verificar si el usuario ya existe ---
        const existingUser = yield User_1.default.findOne({ where: { email: email } }); // Ahora 'email' está declarada
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use.' });
        }
        // --- PASO 4: Hashear contraseña ---
        console.log(`BACKEND (/api/auth/register): Password recibido para hashear: '${password}'`);
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds); // Ahora 'password' está declarada
        console.log(`BACKEND (/api/auth/register): Password hasheado: '${hashedPassword}'`);
        // --- PASO 5: Crear objeto de atributos ---
        const newUserAttributes = {
            name: name,
            email: email,
            password_hash: hashedPassword,
            role: (role || 'client'),
            is_active: true
        };
        console.log('BACKEND (/api/auth/register): Atributos para crear nuevo usuario:', newUserAttributes);
        // --------------------------------
        // --- PASO 6: Crear usuario ---
        const newUser = yield User_1.default.create(newUserAttributes); // Sin 'as any'
        // --- PASO 7: Enviar respuesta ---
        res.status(201).json({
            message: 'User registered successfully!',
            userId: newUser.id
        });
    }
    catch (error) { // El bloque catch no cambia
        console.error("Registration Error:", error);
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Validation or constraint error', details: error.errors });
        }
        res.status(500).json({ message: 'Internal server error during registration.' });
    }
})));
// POST /api/auth/login
app.post('/api/auth/login', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const user = yield User_1.default.findOne({ where: { email } });
        // Verifica usuario y si tiene la propiedad password_hash
        if (!user || !user.password_hash) { // <-- CORREGIDO: Usar password_hash
            console.log(`Login attempt failed: User not found or password missing for email ${email}`);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // Compara la contraseña con el hash guardado
        const isMatch = yield bcrypt_1.default.compare(password, user.password_hash); // <-- CORREGIDO: Usar password_hash
        if (!isMatch) {
            console.log(`Login attempt failed: Password mismatch for email ${email}`);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        // ¡Login Exitoso! (Generar JWT aquí en un caso real)
        console.log(`Login successful for email ${email}`);
        // Aquí es donde debes insertar el código para generar el JWT
        if (!process.env.JWT_SECRET) {
            console.error('Error Crítico: JWT_SECRET no está definido en el archivo .env');
            return res.status(500).json({ message: 'Error interno del servidor: Configuración de autenticación incompleta.' });
        }
        // 2. Prepara el payload para el token
        const tokenPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };
        // 3. Genera el token JWT
        const token = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_SECRET, // Tu clave secreta del archivo .env
        { expiresIn: '1h' } // Tiempo de expiración del token
        );
        // y luego modificar el res.status(200).json({...}) para incluir el token.
        res.status(200).json({
            message: 'Login successful!',
            token: token, // <<< --- AÑADE ESTA LÍNEA ---
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
})));
// --- FIN RUTAS DE AUTENTICACIÓN ---
// --- Función para iniciar el servidor (Sin Cambios) ---
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.testDbConnection)();
        app.listen(port, () => {
            console.log(`✅ Servidor backend escuchando en el puerto ${port}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
});
// Llama a la función para iniciar el servidor (Sin Cambios)
startServer();
