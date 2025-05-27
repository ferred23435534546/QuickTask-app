// backend/src/server.ts
import express, { Request, Response, Application, RequestHandler } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { CreationAttributes } from 'sequelize';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { authenticateToken, AuthenticatedRequest } from './middleware/auth.middleware';
import sequelizeConnection, { testDbConnection } from './config/database';

// --- IMPORTA TUS MODELOS AQUÍ ---
import User from './models/User';
import Profile from './models/Profile';
import Task from './models/Task';
// Importa otros modelos si los tienes

// --- LLAMA A LAS ASOCIACIONES AQUÍ ---
const models = { User, Profile, Task };
Object.values(models).forEach((model: any) => { // 'any' aquí porque no tenemos una interfaz común para modelos con 'associate'
  if (model.associate) {
    model.associate(models); // Pasa todos los modelos para que puedan referenciarse entre sí
  }
});

// dotenv.config(); // No es necesario si ya se carga en database.ts
const app: Application = express();
const port = process.env.PORT || 3000;
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

// --- OPCIONES DE CORS ---
// Permitir solicitudes solo desde el origen de tu frontend Angular
const corsOptions = {
  origin: 'http://localhost:8080', // La URL donde corre tu frontend Angular
  optionsSuccessStatus: 200 // Para algunos navegadores antiguos
};

// --- Middlewares ---
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rutas ---
app.get('/api', (req: Request, res: Response) => {
  res.send('¡Hola desde el Backend de QuickTask!');
});

// --- Rutas de Autenticación ---

// POST /api/auth/register
app.post('/api/auth/register', (async (req: Request, res: Response) => {
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
    const existingUser = await User.findOne({ where: { email: email as string } }); // Ahora 'email' está declarada
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    // --- PASO 4: Hashear contraseña ---
    console.log(`BACKEND (/api/auth/register): Password recibido para hashear: '${password}'`);
    const hashedPassword = await bcrypt.hash(password, saltRounds); // Ahora 'password' está declarada
    console.log(`BACKEND (/api/auth/register): Password hasheado: '${hashedPassword}'`);

    // --- PASO 5: Crear objeto de atributos ---
    const newUserAttributes = {
      name: name as string,
      email: email as string,
      password_hash: hashedPassword,
      role: (role || 'client') as 'client' | 'worker' | 'both' | 'admin',
      is_active: true
    };

    console.log('BACKEND (/api/auth/register): Atributos para crear nuevo usuario:', newUserAttributes);
    // --------------------------------

    // --- PASO 6: Crear usuario ---
    const newUser = await User.create(newUserAttributes as any); // Sin 'as any'

    // --- PASO 7: Enviar respuesta ---
    res.status(201).json({
      message: 'User registered successfully!',
      userId: newUser.id
    });

  } catch (error: any) { // El bloque catch no cambia
    console.error("Registration Error:", error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Validation or constraint error', details: error.errors });
    }
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
}) as RequestHandler);

// POST /api/auth/login
app.post('/api/auth/login', (async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    // Verifica usuario y si tiene la propiedad password_hash
    if (!user || !user.password_hash) { // <-- CORREGIDO: Usar password_hash
      console.log(`Login attempt failed: User not found or password missing for email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Compara la contraseña con el hash guardado
    const isMatch = await bcrypt.compare(password, user.password_hash); // <-- CORREGIDO: Usar password_hash

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
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET, // Tu clave secreta del archivo .env
      { expiresIn: '1h' }    // Tiempo de expiración del token
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

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
}) as RequestHandler);
// --- FIN RUTAS DE AUTENTICACIÓN ---

// --- RUTA PARA OBTENER EL PERFIL DEL USUARIO LOGUEADO ---
app.get('/api/profile/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // Si llegamos aquí, el middleware authenticateToken ya verificó el JWT
  // y req.user contiene el payload del token (ej: { id, email, role })

  if (!req.user) {
    // Esto no debería suceder si authenticateToken funciona bien, pero es una doble verificación
    res.status(401).json({ message: 'Acceso denegado o usuario no autenticado.' });
    return;
  }

  try {
    const userId = req.user.id; // Obtenemos el ID del usuario desde el token

    // Buscamos al usuario y su perfil asociado usando "include"
    // Esto hace un JOIN entre la tabla 'users' y 'profiles'
    const userWithProfile = await User.findByPk(userId, {
      include: [{
        model: Profile,
        as: 'profile' // El alias que definimos en la asociación User.hasOne(Profile, { as: 'profile' })
      }],
      // No queremos devolver el password_hash
      attributes: { exclude: ['password_hash'] }
    });

    if (!userWithProfile) {
      // Esto sería raro si el token es válido, pero podría pasar si el usuario fue borrado después de emitir el token
      res.status(404).json({ message: 'Usuario no encontrado.' });
      return;
    }

    // userWithProfile contendrá los datos de User y, anidado, los datos de Profile si existen
    // Ejemplo: userWithProfile.profile contendría los datos de la tabla 'profiles'
    // Si el usuario no tiene un registro en la tabla 'profiles', userWithProfile.profile será null

    res.status(200).json(userWithProfile);

  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).json({ message: 'Error interno del servidor al obtener el perfil.' });
  }
});

// --- NUEVA RUTA PARA ACTUALIZAR EL PERFIL DEL USUARIO LOGUEADO ---
app.put('/api/profile/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    // Redundante si authenticateToken funciona bien, pero es una salvaguarda
    res.status(401).json({ message: 'Acceso denegado.' });
    return;
  }

  const userId = req.user.id;
  const {
    name, // Para la tabla 'users'
    // Campos para la tabla 'profiles'
    telefono,
    fotoUrl,
    descripcion,
    location_zone,
    habilidades,    // Array de strings
    experiencia,
    categoriasServicio, // Array de strings
    disponibilidad,
    notificacionesActivas // Booleano
  } = req.body;

  try {
    // 1. Actualizar la tabla 'users' (por ejemplo, el nombre)
    const userToUpdate = await User.findByPk(userId);
    if (!userToUpdate) {
      res.status(404).json({ message: 'Usuario no encontrado para actualizar.' });
      return;
    }

    if (name !== undefined && name !== userToUpdate.name) { // Solo actualiza si se envió 'name' y es diferente
      userToUpdate.name = name;
      await userToUpdate.save(); // Guarda los cambios en el usuario
    }

    // 2. Actualizar o Crear en la tabla 'profiles'
    // Preparamos los datos para la tabla 'profiles'
    const profileDataToUpdateOrInsert = {
      user_id: userId, // Muy importante para la relación
      phone_number: telefono,
      profile_picture_url: fotoUrl,
      description: descripcion,
      location_zone: location_zone,
      // Para campos array como habilidades y categoriasServicio, Sequelize los maneja bien si el tipo de columna es JSON o TEXT.
      // Si son tablas de unión separadas, la lógica sería más compleja aquí.
      // Por ahora, asumimos que tu modelo Profile y la tabla profiles pueden manejar arrays directamente
      // (ej. si la columna es de tipo JSON o si guardas strings separados por comas y lo manejas en el modelo/app).
      // En tu migración, `habilidades` y `categoriasServicio` no estaban en la tabla `profiles` directamente,
      // estaban en el formulario del frontend. Si quieres guardarlos, necesitarías pensar cómo (¿campos de texto, JSON, tablas de unión?).
      // Por simplicidad, me enfocaré en los campos que sí están en tu migración de `profiles`:
      // `avg_rating` y `rating_count` usualmente no se actualizan directamente por el usuario.
      // `last_seen` tampoco.
    };

    // Quitamos las propiedades undefined para que no sobreescriban con null si no se envían
    Object.keys(profileDataToUpdateOrInsert).forEach(key =>
      (profileDataToUpdateOrInsert as any)[key] === undefined && delete (profileDataToUpdateOrInsert as any)[key]
    );

    // Usamos findOrCreate para el perfil, y luego actualizamos. O podrías usar upsert si tu dialecto y versión de Sequelize lo soportan bien.
    const [profile, created] = await Profile.findOrCreate({
      where: { user_id: userId },
      defaults: profileDataToUpdateOrInsert // Solo se usan estos defaults si se CREA
    });

    if (!created && Object.keys(profileDataToUpdateOrInsert).length > 1) { // Si no se creó y hay datos para actualizar (más que solo user_id)
      // Si el perfil ya existía, actualizamos solo los campos enviados que no sean user_id
      const { user_id, ...dataToUpdate } = profileDataToUpdateOrInsert; // Excluimos user_id de la actualización directa
      if (Object.keys(dataToUpdate).length > 0) {
        await profile.update(dataToUpdate);
      }
    } else if (created) {
      // Si se creó y los defaults no eran suficientes (ej. si profileDataToUpdateOrInsert tenía más campos que user_id)
      // podríamos necesitar un profile.update() aquí también si los defaults no cubren todo.
      // Pero con la forma en que findOrCreate y defaults funcionan, esto podría ser suficiente.
    }


    // 3. Devolver el perfil actualizado (opcional, pero bueno para confirmar)
    const updatedUserWithProfile = await User.findByPk(userId, {
      include: [{ model: Profile, as: 'profile' }],
      attributes: { exclude: ['password_hash'] }
    });

    res.status(200).json({ message: 'Perfil actualizado con éxito.', user: updatedUserWithProfile });

  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar el perfil.' });
  }
});

// --- AÑADIR NUEVA RUTA PARA CAMBIAR CONTRASEÑA ---
app.post('/api/auth/change-password', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Acceso denegado.' });
    return;
  }

  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  // Validación básica de entrada
  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: 'La contraseña actual y la nueva contraseña son requeridas.' });
    return;
  }

  if (newPassword.length < 6) { // Asumiendo una longitud mínima de 6, igual que en el frontend
    res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    return;
  }

  try {
    const user = await User.findByPk(userId);

    if (!user || !user.password_hash) {
      // Esto no debería pasar si el token es válido y el usuario existe, pero es una salvaguarda
      res.status(404).json({ message: 'Usuario no encontrado o datos corruptos.' });
      return;
    }

    // 1. Verificar la contraseña actual
    const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordMatch) {
      console.log(`Intento de cambio de contraseña fallido para user ID ${userId}: Contraseña actual incorrecta.`);
      res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
      return;
    }

    // 2. Hashear la nueva contraseña
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 3. Actualizar la contraseña en la base de datos
    user.password_hash = hashedNewPassword;
    await user.save();

    console.log(`Contraseña actualizada exitosamente para user ID ${userId}`);
    res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });

  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ message: 'Error interno del servidor al cambiar la contraseña.' });
  }
});

// --- ENDPOINT: Obtener todas las tareas con paginación ---
app.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    // Obtener parámetros de paginación
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const offset = (page - 1) * limit;

    // Obtener parámetros de filtro
    const category = req.query.category as string;
    const keyword = req.query.keyword as string;

    // Construir el objeto where para los filtros
    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (keyword) {
      where["$or"] = [
        { title: { $like: `%${keyword}%` } },
        { description: { $like: `%${keyword}%` } }
      ];
    }

    // Contar el total de tareas filtradas
    const totalCount = await Task.count({ where });

    // Obtener las tareas filtradas y paginadas
    const tasks = await Task.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      tasks,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPreviousPage: page > 1
    });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
});

// --- ENDPOINT: Crear una nueva tarea ---
app.post('/api/tasks', (async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      location,
      budget,
      urgency,
      requirements,
      dateNeeded,
      status,
      userId
    } = req.body;

    // Validación básica
    if (!title || !description || !category || !location || !budget || !urgency || !dateNeeded || !status || !userId) {
      return res.status(400).json({ message: 'Faltan campos obligatorios para crear la tarea.' });
    }

    const newTask = await Task.create({
      title,
      description,
      category,
      location,
      budget,
      urgency,
      requirements,
      dateNeeded,
      status,
      userId
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ message: 'Error al crear tarea' });
  }
}) as RequestHandler);

// --- ENDPOINT: Obtener detalle de una tarea ---
app.get('/api/tasks/:id', (async (req: Request, res: Response) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role'],
          include: [
            {
              model: Profile,
              as: 'profile',
              attributes: ['profile_picture_url', 'avg_rating', 'rating_count']
            }
          ]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Contar tareas publicadas por el usuario propietario
    let user = (task.get('user') as any) || null;
    let tasksCount = 0;
    if (user) {
      tasksCount = await Task.count({ where: { userId: user.id } });
    }

    // Serializar la respuesta para incluir tasksCount y evitar problemas de referencias circulares
    const response = {
      ...task.toJSON(),
      user: user ? {
        ...user,
        tasksCount
      } : null
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener detalle de tarea:', error);
    res.status(500).json({ message: 'Error al obtener detalle de tarea' });
  }
}) as RequestHandler);

// --- Función para iniciar el servidor (Sin Cambios) ---
const startServer = async () => {
  try {
    await testDbConnection();
    app.listen(port, () => {
      console.log(`✅ Servidor backend escuchando en el puerto ${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Llama a la función para iniciar el servidor (Sin Cambios)
startServer();