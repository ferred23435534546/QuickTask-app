// backend/src/server.ts
import express, { Request, Response, Application, RequestHandler } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { CreationAttributes, Op } from 'sequelize'; // <--- AÑADIDO: Importamos Op de sequelize
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { authenticateToken, AuthenticatedRequest } from './middleware/auth.middleware';
import sequelizeConnection, { testDbConnection } from './config/database';

// --- IMPORTA TUS MODELOS AQUÍ ---
import User from './models/User';
import Profile from './models/Profile';
import Task from './models/Task';
// Importa otros modelos si los tienes
// Si tienes un modelo Rating, debes importarlo aquí también si vas a usarlo en el futuro
// import Rating from './models/Rating';
// Si tienes un router de ratings, impórtalo también
// import ratingsRouter from './routes/ratings';

// --- LLAMA A LAS ASOCIACIONES AQUÍ ---
// Asegúrate de que todos tus modelos con asociaciones estén listados aquí
const models = { User, Profile, Task }; // <--- Asegúrate de que 'Task' esté incluido
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models); // Pasa todos los modelos para que puedan referenciarse entre sí
  }
});

// dotenv.config(); // Como mencionas, no es necesario si ya se carga en database.ts

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
  const { email, password, name, role } = req.body;
  console.log(`BACKEND (/api/auth/register): Datos extraídos -> Email: ${email}, Password (plano): '${password}', Name: ${name}, Role: ${role}`);

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, Email and password are required.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email: email as string } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    console.log(`BACKEND (/api/auth/register): Password recibido para hashear: '${password}'`);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`BACKEND (/api/auth/register): Password hasheado: '${hashedPassword}'`);

    const newUserAttributes = {
      name: name as string,
      email: email as string,
      password_hash: hashedPassword,
      role: (role || 'client') as 'client' | 'worker' | 'both' | 'admin',
      is_active: true
    };

    console.log('BACKEND (/api/auth/register): Atributos para crear nuevo usuario:', newUserAttributes);

    const newUser = await User.create(newUserAttributes as any);

    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      userId: newUser.id
    });

  } catch (error: any) {
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

    if (!user || !user.password_hash) {
      console.log(`Login attempt failed: User not found or password missing for email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      console.log(`Login attempt failed: Password mismatch for email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log(`Login successful for email ${email}`);

    if (!process.env.JWT_SECRET) {
      console.error('Error Crítico: JWT_SECRET no está definido en el archivo .env');
      return res.status(500).json({ message: 'Error interno del servidor: Configuración de autenticación incompleta.' });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token: token,
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
  if (!req.user) {
    res.status(401).json({ message: 'Acceso denegado o usuario no autenticado.' });
    return;
  }

  try {
    const userId = req.user.id;

    const userWithProfile = await User.findByPk(userId, {
      include: [{
        model: Profile,
        as: 'profile'
      }],
      attributes: { exclude: ['password_hash'] }
    });

    if (!userWithProfile) {
      res.status(404).json({ message: 'Usuario no encontrado.' });
      return;
    }

    res.status(200).json(userWithProfile);

  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).json({ message: 'Error interno del servidor al obtener el perfil.' });
  }
});

// --- NUEVA RUTA PARA ACTUALIZAR EL PERFIL DEL USUARIO LOGUEADO ---
app.put('/api/profile/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Acceso denegado.' });
    return;
  }

  const userId = req.user.id;
  const {
    name,
    telefono,
    fotoUrl,
    descripcion,
    location_zone,
    habilidades,
    experiencia,
    categoriasServicio,
    disponibilidad,
    notificacionesActivas
  } = req.body;

  try {
    const userToUpdate = await User.findByPk(userId);
    if (!userToUpdate) {
      res.status(404).json({ message: 'Usuario no encontrado para actualizar.' });
      return;
    }

    if (name !== undefined && name !== userToUpdate.name) {
      userToUpdate.name = name;
      await userToUpdate.save();
    }

    const profileDataToUpdateOrInsert = {
      user_id: userId,
      phone_number: telefono,
      profile_picture_url: fotoUrl,
      description: descripcion,
      location_zone: location_zone,
    };

    Object.keys(profileDataToUpdateOrInsert).forEach(key =>
      (profileDataToUpdateOrInsert as any)[key] === undefined && delete (profileDataToUpdateOrInsert as any)[key]
    );

    const [profile, created] = await Profile.findOrCreate({
      where: { user_id: userId },
      defaults: profileDataToUpdateOrInsert
    });

    if (!created && Object.keys(profileDataToUpdateOrInsert).length > 1) {
      const { user_id, ...dataToUpdate } = profileDataToUpdateOrInsert;
      if (Object.keys(dataToUpdate).length > 0) {
        await profile.update(dataToUpdate);
      }
    } else if (created) {
      // If created, defaults should have been applied. No need for another update here
    }

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

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: 'La contraseña actual y la nueva contraseña son requeridas.' });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    return;
  }

  try {
    const user = await User.findByPk(userId);

    if (!user || !user.password_hash) {
      res.status(404).json({ message: 'Usuario no encontrado o datos corruptos.' });
      return;
    }

    const isCurrentPasswordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordMatch) {
      console.log(`Intento de cambio de contraseña fallido para user ID ${userId}: Contraseña actual incorrecta.`);
      res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password_hash = hashedNewPassword;
    await user.save();

    console.log(`Contraseña actualizada exitosamente para user ID ${userId}`);
    res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });

  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).json({ message: 'Error interno del servidor al cambiar la contraseña.' });
  }
});

// --- ENDPOINT: Obtener todas las tareas con paginación y búsqueda por nombre ---
app.get('/api/tasks', async (req: Request, res: Response) => {
  console.log('Backend (GET /api/tasks): Solicitud recibida.');
  console.log('Backend (GET /api/tasks): Query parameters:', req.query);

  try {
    // Obtener parámetros de paginación
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const offset = (page - 1) * limit;

    // Obtener parámetros de filtro
    const category = req.query.category as string;
    const nombreBuscado = req.query.nombre as string; // <--- CAMBIO: Ahora espera 'nombre'

    // Construir el objeto where para los filtros
    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (nombreBuscado) { // <--- CAMBIO: Usa 'nombreBuscado'
      console.log(`Backend (GET /api/tasks): Buscando por nombre: "${nombreBuscado}"`);
      where.title = { // <--- VERIFICA ESTO: ¿Tu columna se llama 'title' o 'nombre' en la DB?
        [Op.iLike]: `%${nombreBuscado}%` // Búsqueda insensible a mayúsculas/minúsculas
      };
      // Si también quieres buscar en la descripción, puedes usar un OR:
      // where[Op.or] = [
      //   { title: { [Op.iLike]: `%${nombreBuscado}%` } },
      //   { description: { [Op.iLike]: `%${nombreBuscado}%` } }
      // ];
    }

    // Contar el total de tareas filtradas
    const totalCount = await Task.count({ where });
    console.log(`Backend (GET /api/tasks): Tareas totales (filtradas): ${totalCount}`);


    // Obtener las tareas filtradas y paginadas
    const tasks = await Task.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    console.log(`Backend (GET /api/tasks): Tareas encontradas en esta página: ${tasks.length}`);


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
          attributes: ['id', 'name', 'email', 'role']
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

// --- Función para iniciar el servidor ---
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

// Llama a la función para iniciar el servidor
startServer();