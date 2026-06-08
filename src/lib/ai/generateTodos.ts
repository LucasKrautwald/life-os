import type { Area } from "@/lib/mock";

export interface GeneratedTodo {
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
  return [...FALLBACK_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
}

const VALID_AREAS: Area[] = ["school", "health", "agency", "finance", "discipline"];

const SYSTEM_PROMPT = `Eres el asistente personal de Lucas, un estudiante de 11° IB en Medellín.
Dado el contexto: [tareas pendientes], [hábitos fallidos], [exámenes próximos],
genera exactamente 3 todos para hoy. Sé específico y accionable.
Responde SOLO en JSON: [{"text": "...", "area": "school|health|agency|finance"}]`;

/**
 * Generates 3 daily todos via Claude Haiku, falling back to a sensible
 * sample set if no API key is configured or the request fails.
 */
export async function generateDailyTodos(
  context?: string
): Promise<GeneratedTodo[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return sampleFallback();

  try {
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
              context ??
              "Contexto: 2 tareas del colegio pendientes, no completaste 'sin junk food' ni 'lectura' ayer, quiz de Chemistry mañana.",
          },
        ],
      }),
    });

    if (!res.ok) return sampleFallback();

    const data = await res.json();
    const raw = data?.content?.[0]?.text ?? "[]";
    const parsed = JSON.parse(raw) as GeneratedTodo[];

    const cleaned = parsed
      .filter((t) => t && typeof t.text === "string")
      .slice(0, 3)
      .map((t) => ({
        text: t.text,
        area: VALID_AREAS.includes(t.area) ? t.area : "discipline",
      }));

    return cleaned.length > 0 ? cleaned : sampleFallback();
  } catch {
    return sampleFallback();
  }
}
