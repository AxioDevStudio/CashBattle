import {
    getProfileService,
    updateProfileService,
    uploadAvatarService,
    removeAvatarService,
    changePasswordService
} from "../services/profileService.js";

export async function getProfile(req, res) {
    try {
        const profile = await getProfileService(req.userId);

        return res.json({ profile });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

export async function updateProfileData(req, res) {
    try {
        const profile = await updateProfileService(req.userId, req.body);

        return res.json({
            message: "Perfil atualizado com sucesso.",
            profile
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function uploadAvatar(req, res) {
    try {
        const profile = await uploadAvatarService(req.userId, req.file);

        return res.json({
            message: "Foto de perfil atualizada com sucesso.",
            profile
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function deleteAvatar(req, res) {
    try {
        const profile = await removeAvatarService(req.userId);

        return res.json({
            message: "Foto de perfil removida com sucesso.",
            profile
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export async function changePassword(req, res) {
    try {
        await changePasswordService(req.userId, req.body);

        return res.json({
            message: "Senha alterada com sucesso."
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}