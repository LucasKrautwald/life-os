import { NextResponse } from "next/server";
import type { Area } from "@/lib/mock";

interface GeneratedTodo {
  text: string;
  area: Area;
}

const FALLBACK_POOL: GeneratedTodo[] = [
  { text: "Avanzar 1h en el IA de Math AA", area: "school" },
  { text: "Repasar flashcards de Chemistry HL", area: "school" },
  { text: "Correr 5 km a ritmo suave", area: "health" },
  { text: "Sesión de gym — pull day", area: "health" },
  { text: "Dormir antes de las 23:00", area: "health" },
  { text: "Enviar update semanal a LatinLeap", area: "agency" },
  { text: "Preparar propuesta de setup para Bitpoint", area: "agency" },
  { text: "Registrar gastos del día", area: "finance" },
  { text: "Revisar movimiento del portafolio", area: "finance" },
  { text: "Leer 20 páginas", area: "discipline" },
];

function sampleFallback(): GeneratedTodo[] {
  const shuffled = [...FALLBACK_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

const SYSTEM_PROMPT = `Eres el asistente personal de Lucas, un estudiante de 11° IB en Medellín.
Dado el contexto: [tareas pendientes], [hábitos fallidos], [exámenes próximos],
genera exactamente 3 todos para hoy. Sé específico y accionable.
Responde SOLO en JSON: [{"text": "...", "area": "school|health|agency|finance"}]`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // No key configured → return sensible sample todos so the UI keeps working.
  if (!apiKey) {
    return NextResponse.json({ todos: sampleFallback(), source: "fallback" });
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      context?: string;
    };

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content:
              body.context ??
              "Contexto: 2 tareas del colegio pendientes, no completaste 'sin junk food' ni 'lectura' ayer, quiz de Chemistry mañana.",
          },
        ],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ todos: sampleFallback(), source: "fallback" });
    }

    const data = await res.json();
    const raw = data?.content?.[0]?.text ?? "[]";
    const parsed = JSON.parse(raw) as GeneratedTodo[];
    return NextResponse.json({ todos: parsed.slice(0, 3), source: "claude" });
  } catch {
    return NextResponse.json({ todos: sampleFallback(), source: "fallback" });
  }
}
