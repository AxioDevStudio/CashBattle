import crypto from "crypto";

import {
    createUser,
    findUserByEmail,
    findUserById,
    updateUserPassword
} from "../models/userModel.js";

import {
    createPasswordResetToken,
    findValidPasswordResetToken,
    markPasswordResetTokenAsUsed,
    deleteOldPasswordResetTokens
} from "../models/passwordResetModel.js";

import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";
import { sendResetPasswordEmail } from "./emailService.js";

export async function registerService({
    name,
    email,
    password,
    monthlyIncome,
    otherIncome,
    monthlyGoal,
    goalCategory,
    competitionMode
}) {
    if (!name || !email || !password) {
        throw new Error("Nome, email e senha são obrigatórios.");
    }

    const userExists = await findUserByEmail(email);

    if (userExists) {
        throw new Error("Este email já está cadastrado.");
    }

    const hashedPassword = await hashPassword(password);

    const user = await createUser({
        name,
        email,
        password: hashedPassword,
        monthlyIncome,
        otherIncome,
        monthlyGoal,
        goalCategory,
        competitionMode
    });

    const token = generateToken(user.id);

    return { user, token };
}

export async function loginService({ email, password }) {
    if (!email || !password) {
        throw new Error("Email e senha são obrigatórios.");
    }

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Email ou senha inválidos.");
    }

    const passwordIsValid = await comparePassword(password, user.password);

    if (!passwordIsValid) {
        throw new Error("Email ou senha inválidos.");
    }

    const token = generateToken(user.id);

    delete user.password;

    return { user, token };
}

export async function meService(userId) {
    const user = await findUserById(userId);

    if (!user) {
        throw new Error("Usuário não encontrado.");
    }

    return user;
}

export async function forgotPasswordService(email) {
    if (!email) {
        throw new Error("Email é obrigatório.");
    }

    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    await deleteOldPasswordResetTokens(user.id);

    const resetToken = crypto.randomBytes(32).toString("hex");

    await createPasswordResetToken({
        userId: user.id,
        token: resetToken
    });

    await sendResetPasswordEmail(
        user.email,
        resetToken
    );

    return true;
}

export async function resetPasswordService(token, password) {
    if (!token || !password) {
        throw new Error("Token e nova senha são obrigatórios.");
    }

    if (password.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres.");
    }

    const resetData = await findValidPasswordResetToken(token);

    if (!resetData) {
        throw new Error("Token inválido ou expirado.");
    }

    const hashedPassword = await hashPassword(password);

    await updateUserPassword(resetData.user_id, hashedPassword);

    await markPasswordResetTokenAsUsed(token);

    return true;
}