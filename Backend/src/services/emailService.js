import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(email, resetToken) {
    const resetLink =
        `${process.env.APP_URL}/reset-password/${resetToken}`;
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
}