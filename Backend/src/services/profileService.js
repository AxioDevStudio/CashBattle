import fs from "fs";

import {
    getProfileById,
    updateProfile,
    updateAvatar,
    removeAvatar,
    updatePassword
} from "../models/profileModel.js";

import { findUserById } from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";

export async function getProfileService(userId) {
    const profile = await getProfileById(userId);

    if (!profile) {
        throw new Error("Perfil não encontrado.");
    }

    return profile;
}

export async function updateProfileService(userId, data) {
    const profile = await updateProfile(userId, data);

    if (!profile) {
        throw new Error("Perfil não encontrado.");
    }

    return profile;
}

export async function uploadAvatarService(userId, file) {
    if (!file) {
        throw new Error("Nenhuma imagem enviada.");
    }

    const oldProfile = await getProfileById(userId);

    if (oldProfile?.avatar_url) {
        const oldPath = `.${oldProfile.avatar_url}`;

        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;

    return await updateAvatar(userId, avatarUrl);
}

export async function removeAvatarService(userId) {
    const profile = await getProfileById(userId);

    if (profile?.avatar_url) {
        const filePath = `.${profile.avatar_url}`;

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    return await removeAvatar(userId);
}

export async function changePasswordService(userId, data) {
    const { currentPassword, newPassword, confirmPassword } = data;

    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new Error("Preencha todos os campos.");
    }

    if (newPassword.length < 6) {
        throw new Error("A nova senha deve ter pelo menos 6 caracteres.");
    }

    if (newPassword !== confirmPassword) {
        throw new Error("As senhas não conferem.");
    }

    const user = await findUserById(userId);

    if (!user) {
        throw new Error("Usuário não encontrado.");
    }

    const validPassword = await comparePassword(currentPassword, user.password);

    if (!validPassword) {
        throw new Error("Senha atual incorreta.");
    }

    const hashedPassword = await hashPassword(newPassword);

    return await updatePassword(userId, hashedPassword);
}