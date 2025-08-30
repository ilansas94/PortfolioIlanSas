import { NextResponse } from "next/server";
import { Resend } from "resend";

type Incoming = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(req: Request) {
  try {
    const { name, email, subject, message }: Incoming = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "Portfolio <onboarding@resend.dev>",
      to: process.env.EMAIL_TO || "ilansas94@gmail.com",
      subject: `[Portfolio] ${subject}`,
      reply_to: email,
      html: `
        <div style="font-family:Inter,Segoe UI,Arial,sans-serif;line-height:1.6;color:#0f172a;">
          <h2 style="margin:0 0 8px;">New message from portfolio</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p style="white-space:pre-wrap;"><strong>Message:</strong><br/>${escapeHtml(message)}</p>
        </div>
      `,
      text: `New message from portfolio\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/contact error", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


