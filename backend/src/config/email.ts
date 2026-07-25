import nodemailer, { Transporter } from 'nodemailer';

const isConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);

export const emailEnabled = isConfigured;

export const transporter: Transporter | null = isConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

export default transporter;
