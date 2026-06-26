import { createUser, findUserByEmail, findUserById } from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/generateToken.js";

export async function registerService({ name, email, password }) {
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
        password: hashedPassword
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