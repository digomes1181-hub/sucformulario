import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { nome, email, cpf, data_nascimento, chefe_de_equipe } = req.body || {};

  if (!email || !nome) {
    return res.status(400).json({ error: 'E-mail e nome são obrigatórios.' });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Semana Universitária <onboarding@resend.dev>';

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: '🎉 Inscrição Confirmada - Semana Universitária Cajuruense',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #0f172a; color: #f1f5f9; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155; }
            .header { text-align: center; border-bottom: 1px solid #334155; padding-bottom: 20px; margin-bottom: 24px; }
            .header h1 { color: #818cf8; margin: 0 0 8px 0; font-size: 22px; }
            .header p { color: #94a3b8; margin: 0; font-size: 14px; }
            .badge { display: inline-block; background-color: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 6px 16px; border-radius: 100px; font-weight: bold; font-size: 13px; margin-bottom: 20px; }
            .content p { line-height: 1.6; color: #cbd5e1; font-size: 15px; }
            .details-box { background-color: #0f172a; border-radius: 12px; padding: 20px; border: 1px solid #334155; margin: 24px 0; }
            .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #334155; font-size: 14px; }
            .details-row:last-child { border-bottom: none; }
            .label { color: #94a3b8; }
            .value { color: #f1f5f9; font-weight: bold; }
            .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #334155; color: #64748b; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Semana Universitária Cajuruense 🚀</h1>
              <p>Confirmação de Inscrição</p>
            </div>
            <div style="text-align: center;">
              <span class="badge">✓ Inscrição Confirmada</span>
            </div>
            <div class="content">
              <p>Olá, <strong>${nome}</strong>!</p>
              <p>Sua inscrição na <strong>Semana Universitária Cajuruense</strong> foi realizada e gravada com sucesso em nosso sistema!</p>
              
              <div class="details-box">
                <div class="details-row">
                  <span class="label">Nome Completo:</span>
                  <span class="value">${nome}</span>
                </div>
                <div class="details-row">
                  <span class="label">CPF:</span>
                  <span class="value">${cpf}</span>
                </div>
                <div class="details-row">
                  <span class="label">E-mail:</span>
                  <span class="value">${email}</span>
                </div>
                <div class="details-row">
                  <span class="label">Data de Nasc.:</span>
                  <span class="value">${data_nascimento}</span>
                </div>
                <div class="details-row">
                  <span class="label">Interesse em Chefe de Equipe:</span>
                  <span class="value">${chefe_de_equipe ? 'Sim' : 'Não'}</span>
                </div>
              </div>

              <p>Fique atento às nossas divulgações para acompanhar o cronograma das atividades.</p>
            </div>
            <div class="footer">
              <p>Semana Universitária Cajuruense • E-mail enviado automaticamente</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Erro ao enviar e-mail via Resend:', error);
    return res.status(500).json({ error: error.message || 'Erro ao enviar e-mail' });
  }
}
