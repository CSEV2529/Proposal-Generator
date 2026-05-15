import { Resend } from 'resend';

let client: Resend | null = null;

function getClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export interface InviteEmailParams {
  toEmail: string;
  name?: string | null;
  tempPassword: string;
  loginUrl: string;
}

export interface SendResult {
  sent: boolean;
  reason?: string;
  id?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendInviteEmail(params: InviteEmailParams): Promise<SendResult> {
  const c = getClient();
  if (!c) return { sent: false, reason: 'RESEND_API_KEY not configured' };

  const from = process.env.EMAIL_FROM || 'ChargeSmart EV <onboarding@resend.dev>';
  const greeting = params.name?.trim() || params.toEmail;

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;background:#ffffff;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="margin:0;font-size:24px;font-weight:700;"><span style="color:#4CBC88;">Charge</span>Smart EV</h1>
    <p style="margin:4px 0 0;color:#888;font-size:14px;">Proposal Generator</p>
  </div>
  <h2 style="font-size:18px;margin:0 0 16px;">Hi ${escapeHtml(greeting)},</h2>
  <p style="line-height:1.5;">You've been invited to the ChargeSmart EV Proposal Generator. Use the credentials below to log in:</p>
  <div style="background:#f4f4f4;border-left:4px solid #4CBC88;border-radius:4px;padding:16px;margin:24px 0;font-family:'Menlo',monospace;font-size:14px;">
    <div style="margin:0 0 6px;"><strong>Email:</strong> ${escapeHtml(params.toEmail)}</div>
    <div><strong>Temporary password:</strong> ${escapeHtml(params.tempPassword)}</div>
  </div>
  <p style="margin:24px 0;">
    <a href="${escapeHtml(params.loginUrl)}" style="display:inline-block;background:#4CBC88;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:6px;font-weight:600;">Log In</a>
  </p>
  <p style="color:#888;font-size:13px;line-height:1.5;">You'll be prompted to change your password the first time you log in. If you didn't expect this email, you can ignore it.</p>
  <p style="color:#aaa;font-size:12px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">ChargeSmart EV &middot; (888) 717-4544</p>
</div>
`.trim();

  const text = `Hi ${greeting},

You've been invited to the ChargeSmart EV Proposal Generator.

Email: ${params.toEmail}
Temporary password: ${params.tempPassword}

Log in: ${params.loginUrl}

You'll be prompted to change your password on first login.

ChargeSmart EV - (888) 717-4544`;

  try {
    const result = await c.emails.send({
      from,
      to: params.toEmail,
      subject: 'Welcome to the ChargeSmart EV Proposal Generator',
      html,
      text,
    });
    if (result.error) return { sent: false, reason: result.error.message };
    return { sent: true, id: result.data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { sent: false, reason: message };
  }
}
