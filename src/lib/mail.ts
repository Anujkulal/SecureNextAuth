import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || '');
export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Please confirm your email",
        html: `
        <p>Hi there,</p>
        <p>Thanks for signing up! Please confirm your email address by clicking the link below:</p>
        <a href="${confirmLink}">${confirmLink}</a>
        <p>If you didn't sign up for this account, you can ignore this email.</p>
        ` 
    })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `
        <p>Hi there,</p>
        <p>We received a request to reset your password. You can reset it by clicking the link below:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn't request a password reset, you can ignore this email.</p>
        `
    })
    
}