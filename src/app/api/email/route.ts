import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo, emailDestino, token, nome, idFuncionario } = body;

    if (!tipo || !emailDestino) {
      return NextResponse.json(
        { erro: "Campos 'tipo' e 'emailDestino' são obrigatórios." },
        { status: 400 }
      );
    }

    // ─── E-mail de Redefinição de Senha ───────────────────────────
    if (tipo === "redefinicao-senha") {
      // Monta o link de redefinição com o token
      const frontendUrl = process.env.NEXT_PUBLIC_API_URL
        ? new URL(process.env.NEXT_PUBLIC_API_URL).origin.replace("8080", "3000")
        : "http://localhost:3000";

      const linkRedefinicao = `${frontendUrl}/redefinir-senha?token=${token}`;

      const { data, error } = await resend.emails.send({
        from: "BiblioTech <onboarding@resend.dev>",
        to: ["suportebibliotech26@gmail.com"],
        subject: "Redefinição de Senha — BiblioTech",
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
            <h2 style="color: #1e293b; margin-bottom: 8px;">Olá, ${nome || "Funcionário"}!</h2>
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
              Recebemos uma solicitação para redefinir a senha da sua conta no <strong>BiblioTech</strong>.
            </p>
            <div style="margin: 24px 0;">
              <a href="${linkRedefinicao}"
                 style="display: inline-block; background: #6366f1; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
                Redefinir Minha Senha
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
              Este link expira em <strong>15 minutos</strong>.<br/>
              Se você não solicitou esta redefinição, ignore este e-mail.
            </p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #cbd5e1; font-size: 11px;">
              BiblioTech — Sistema de Gerenciamento de Biblioteca
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("[Resend] Erro ao enviar e-mail de redefinição:", error);
        return NextResponse.json({ erro: "Falha ao enviar e-mail." }, { status: 500 });
      }

      return NextResponse.json({ sucesso: true, id: data?.id });
    }

    // ─── E-mail de Aprovação de Cadastro ──────────────────────────
    if (tipo === "aprovacao-cadastro") {
      const frontendUrl = process.env.NEXT_PUBLIC_API_URL
        ? new URL(process.env.NEXT_PUBLIC_API_URL).origin.replace("8080", "3000")
        : "http://localhost:3000";

      const linkAprovacao = `${frontendUrl}/cadastro-suporte?id=${idFuncionario}&nome=${encodeURIComponent(nome || "")}`;

      const { data, error } = await resend.emails.send({
        from: "BiblioTech <onboarding@resend.dev>",
        to: ["suportebibliotech26@gmail.com"],
        subject: "Nova Solicitação de Acesso — BiblioTech",
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
            <h2 style="color: #1e293b; margin-bottom: 8px;">Nova Solicitação de Acesso</h2>
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
              O funcionário <strong>${nome}</strong> solicitou acesso ao sistema <strong>BiblioTech</strong>.
            </p>
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
              Clique no botão abaixo para aprovar o cadastro e definir o perfil de acesso.
            </p>
            <div style="margin: 24px 0;">
              <a href="${linkAprovacao}"
                 style="display: inline-block; background: #10b981; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
                Aprovar Cadastro
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
            <p style="color: #cbd5e1; font-size: 11px;">
              BiblioTech — Sistema de Gerenciamento de Biblioteca
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("[Resend] Erro ao enviar e-mail de aprovação:", error);
        return NextResponse.json({ erro: "Falha ao enviar e-mail." }, { status: 500 });
      }

      return NextResponse.json({ sucesso: true, id: data?.id });
    }

    return NextResponse.json({ erro: "Tipo de e-mail inválido." }, { status: 400 });
  } catch (error) {
    console.error("[API Email] Erro:", error);
    return NextResponse.json({ erro: "Erro interno do servidor." }, { status: 500 });
  }
}
