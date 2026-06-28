import {
    getProfileById,
    updateProfile,
    updateAvatar,
    removeAvatar
} from "../models/profileModel.js";

export async function getProfileService(userId) {
    const profile = await getProfileById(userId);

    if (!profile) {
        throw new Error("Perfil não encontrado.");
    }

    return profile;
}

export async function updateProfileService(userId, data) {
    return await updateProfile(userId, data);
}

export async function uploadAvatarService(userId, file) {
    if (!file) {
        throw new Error("Nenhuma imagem enviada.");
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;

    return await updateAvatar(userId, avatarUrl);
}

export async function removeAvatarService(userId) {
    return await removeAvatar(userId);
}