import { Resend } from "resend";

export async function sendResetPasswordEmail(email, resetToken) {
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const resetLink = `${appUrl}/reset-password/${resetToken}`;

    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
        console.warn("[CashBattle Mock Email] Resend not configured. Password reset link:", resetLink);
        return { mock: true, resetLink };
    }

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const result = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Recuperação de senha - CashBattle",
            html: `
                <h2>Recuperação de senha</h2>
                <p>Clique no link abaixo para redefinir sua senha:</p>
                <a href="${resetLink}">Redefinir senha</a>
                <p>Este link expira em 30 minutos.</p>
            `
        });

        console.log("Resultado Resend:", result);
        return result;
    } catch (err) {
        console.error("Erro ao enviar email via Resend:", err.message);
        console.warn("[CashBattle Mock Email] Fallback reset link:", resetLink);
        return { mock: true, resetLink };
    }
}