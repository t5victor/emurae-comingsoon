import type { APIContext } from "astro";
import { Resend } from "resend";

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function POST({ request }: APIContext) {
	try {
		const { email } = await request.json() as { email?: string };

		if (!email || typeof email !== "string") {
			return new Response(JSON.stringify({ error: "Correo inválido." }), {
				status: 400,
				headers: { "Content-Type": "application/json" },
			});
		}

		await resend.emails.send({
			from: "onboarding@resend.dev",
			to: "nevagroupclientes@gmail.com",
			subject: "Nuevo registro en la landing",
			html: `<p>Se ha registrado un nuevo correo:</p><p><strong>${email}</strong></p>`,
		});

		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("[subscribe] Error enviando correo", error);

		return new Response(
			JSON.stringify({ error: "No fue posible procesar la solicitud en este momento." }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
}
