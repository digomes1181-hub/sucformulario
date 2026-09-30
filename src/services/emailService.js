import { Resend } from 'resend';

export async function sendConfirmationEmail(participantData) {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;

  // 1. Try calling Vercel API Serverless route first
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participantData),
    });

    if (response.ok) {
      console.log('✅ E-mail de confirmação enviado via /api/send-email!');
      return true;
    }
  } catch {
    // Serverless API route not available in static local dev server
  }

  // 2. Fallback: Direct Resend SDK call if VITE_RESEND_API_KEY is configured
  if (apiKey && apiKey.startsWith('re_') && !apiKey.includes('SUA_CHAVE')) {
    try {
      const resend = new Resend(apiKey);
      const fromEmail = import.meta.env.VITE_RESEND_FROM_EMAIL || 'Semana Universitária <onboarding@resend.dev>';

      const data = await resend.emails.send({
        from: fromEmail,
        to: [participantData.email],
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
                <p>Olá, <strong>${participantData.nome}</strong>!</p>
                <p>Sua inscrição na <strong>Semana Universitária Cajuruense</strong> foi registrada com sucesso!</p>
                
                <div class="details-box">
                  <div class="details-row">
                    <span class="label">Nome Completo:</span>
                    <span class="value">${participantData.nome}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">CPF:</span>
                    <span class="value">${participantData.cpf}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">E-mail:</span>
                    <span class="value">${participantData.email}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Data de Nasc.:</span>
                    <span class="value">${participantData.data_nascimento}</span>
                  </div>
                  <div class="details-row">
                    <span class="label">Interesse em Chefe de Equipe:</span>
                    <span class="value">${participantData.chefe_de_equipe ? 'Sim' : 'Não'}</span>
                  </div>
                </div>

                <p>Acompanhe nossas redes sociais para saber todas as novidades e o cronograma do evento.</p>
              </div>
              <div class="footer">
                <p>Semana Universitária Cajuruense • E-mail automático de confirmação</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log('✅ E-mail enviado com sucesso via Resend SDK!', data);
      return true;
    } catch (err) {
      console.warn('⚠️ Erro ao enviar e-mail via Resend SDK:', err);
    }
  }

  console.info('ℹ️ Chave do Resend não configurada ou inválida.');
  return false;
}
