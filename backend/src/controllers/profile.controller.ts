import db from '../models/edit'; // Importa la instancia de la base de datos
import { Request, Response } from 'express';
import { Transaction } from 'sequelize'; // Importa Transaction

// Define un tipo para el usuario autenticado
interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
    };
}

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user || typeof req.user.id === 'undefined') {
            return res.status(401).json({ message: 'Usuario no autenticado o ID no encontrado.' });
        }

        const userId = req.user.id;
        const { name, phone, location, role, profile } = req.body;

        console.log(`[UpdateProfile] UserID: ${userId}`);
        console.log(`[UpdateProfile] Received Body:`, JSON.stringify(req.body, null, 2)); // Log más legible

        await db.sequelize.transaction(async (t: Transaction) => {
            // 1. Prepara los datos para actualizar 'users'.
            const userUpdateData: any = {};
            // Solo añadimos la clave si el valor NO es undefined.
            // Si el frontend envía null, se intentará guardar null.
            if (name !== undefined) userUpdateData.name = name;
            if (phone !== undefined) userUpdateData.phone = phone;
            if (location !== undefined) userUpdateData.location = location;
            if (role !== undefined) userUpdateData.role = role;

            if (Object.keys(userUpdateData).length > 0) {
                console.log(`[UpdateProfile] Attempting to update User [${userId}] with:`, userUpdateData);
                const [userUpdateCount] = await db.User.update(userUpdateData, { where: { id: userId }, transaction: t });
                console.log(`[UpdateProfile] User update result (rows affected): ${userUpdateCount}`);
                // Si userUpdateCount es 0 y esperabas cambios, ¡ALGO ESTÁ MAL! (Probablemente el modelo User.ts)
            } else {
                 console.log(`[UpdateProfile] No data provided to update User.`);
            }

            // 2. Prepara y actualiza/crea 'profiles'.
            if (profile && Object.keys(profile).length > 0) {
                const profileDataToUpdate: any = {};
                // Solo añadimos si no es undefined.
                if (profile.phone_number !== undefined) profileDataToUpdate.phone_number = profile.phone_number;
                if (profile.location_zone !== undefined) profileDataToUpdate.location_zone = profile.location_zone;
                // No incluimos description

                if (Object.keys(profileDataToUpdate).length > 0) {
                    console.log(`[UpdateProfile] Attempting to find/create/update Profile for UserID [${userId}] with:`, profileDataToUpdate);
                    const [profileInstance, created] = await db.Profile.findOrCreate({
                        where: { user_id: userId },
                        defaults: { user_id: userId, ...profileDataToUpdate },
                        transaction: t
                    });

                    if (!created) {
                        console.log(`[UpdateProfile] Profile existed, updating...`);
                        const [profileUpdateCount] = await db.Profile.update(profileDataToUpdate, { where: { user_id: userId }, transaction: t, returning: false }); // Usamos update directo
                        console.log(`[UpdateProfile] Profile update result (rows affected): ${profileUpdateCount}`);
                    } else {
                         console.log(`[UpdateProfile] Created new Profile.`);
                    }
                } else {
                    console.log(`[UpdateProfile] No data provided to update Profile.`);
                }
            }
        });

        console.log(`[UpdateProfile] Transaction committed. Fetching updated data...`);
        const updatedUser = await db.User.findByPk(userId, {
            include: [{ model: db.Profile, as: 'profile' }]
        });

        res.json({ message: 'Perfil actualizado con éxito', user: updatedUser });

    } catch (error: any) {
        console.error('ERROR updating profile:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
    }
};