import { createTransport } from 'nodemailer'
import { NextResponse } from 'next/server'

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: Request) {
  try {
    const { email, groupName, inviteUrl } = await request.json()

    await transporter.sendMail({
      from: `"MateCuentas" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: `Invitación al grupo ${groupName} en MateCuentas`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6E8B3D;">Te han invitado a unirte a ${groupName}</h1>
          <p>Has sido invitado a unirte al grupo ${groupName} en MateCuentas.</p>
          <p>Para ver los detalles del grupo y aceptar la invitación, haz clic en el siguiente enlace:</p>
          <a href="${inviteUrl}" 
             style="display: inline-block; background: #6E8B3D; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 5px;
                    margin: 20px 0;">
            Ver invitación
          </a>
          <p style="color: #666;">Este enlace expirará en 7 días.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #888; font-size: 12px;">
            Si no esperabas esta invitación, puedes ignorar este correo.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Error al enviar el correo' },
      { status: 500 }
    )
  }
}

