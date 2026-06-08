import { NextResponse } from "next/server";
import { generateDailyTodos } from "@/lib/ai/generateTodos";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { context?: string };
  const todos = await generateDailyTodos(body.context);
  return NextResponse.json({ todos });
}
