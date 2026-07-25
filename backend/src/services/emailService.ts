import transporter, { emailEnabled } from '../config/email';
import type { Lead } from '../models/Lead';

/**
 * Sends a notification when a new lead (enquiry/application) comes in.
 * Falls back to a console log in development when SMTP isn't configured,
 * so the app is fully usable without a real mail provider.
 */
export const sendLeadNotification = async (lead: Lead) => {
  const subject = `New ${lead.purpose.toLowerCase()} enquiry — ${lead.name}`;
  const body = `Name: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || '—'}\nMessage: ${lead.message || '—'}`;

  if (!emailEnabled || !transporter) {
    console.log(`[emailService] (dev mode, no SMTP configured) ${subject}\n${body}`);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_FROM, // notify the platform inbox
    subject,
    text: body,
  });
};

export const sendWelcomeEmail = async (name: string, email: string) => {
  const subject = `Welcome to Campus Unlock, ${name}!`;
  const body = `Hi ${name},\n\nYour account is ready. Start exploring universities and courses at Campus Unlock.`;

  if (!emailEnabled || !transporter) {
    console.log(`[emailService] (dev mode, no SMTP configured) -> ${email}: ${subject}`);
    return;
  }

  await transporter.sendMail({ from: process.env.EMAIL_FROM, to: email, subject, text: body });
};
