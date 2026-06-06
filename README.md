# ⚡ Life OS

Plataforma web personal (uso exclusivo de Lucas) que centraliza finanzas,
agencia, colegio, salud, hábitos y tareas diarias. Un "external brain" visual,
automatizado y accionable.

> Stack: **Next.js 14 (App Router)** · **TypeScript** · **Tailwind CSS** ·
> **Framer Motion** · **Supabase** · **Vercel**

---

## Empezar

```bash
npm install
cp .env.example .env.local   # opcional para el primer arranque
npm run dev
```

Abre <http://localhost:3000>.

### Modo demo (sin backend)

La app **funciona sin configurar nada**: si no hay variables de Supabase, el
middleware de auth se desactiva y todas las pantallas se renderizan con datos de
ejemplo (`src/lib/mock.ts`). El login te deja entrar en "modo demo".

### Conectar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ejecuta `supabase/schema.sql` en el SQL editor (crea tablas + RLS).
3. Copia las llaves a `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

4. Crea el usuario de Lucas en **Authentication → Users**.

Con Supabase configurado, el middleware protege todas las rutas y redirige a
`/login`.

---

## Estructura

```
src/
  app/
    (app)/              # rutas autenticadas (con sidebar)
      page.tsx          # Dashboard diario
      finances/         # Portafolio · Agencia · Personal
      discipline/       # Hábitos + contribution graph
      school/           # Materias IB + notas
      health/           # Garmin / Apple Health
      progress/         # Scores por área
      food/             # Fase 2
      settings/
    api/todos/generate/ # genera los 3 todos (Claude o fallback)
    login/
  components/           # UI, layout, dashboard, etc.
  lib/
    supabase/           # clients browser/server + middleware
    mock.ts             # datos de ejemplo (modo demo)
    format.ts           # formato COP/USD/%/fechas
    constants.ts        # navegación + estilos por área
supabase/schema.sql     # tablas + Row Level Security
```

## Design system

Minimal dark inspirado en Linear / Vercel. Tokens en
`src/app/globals.css` (`--accent: #e8ff47`). Animaciones con Framer Motion,
skeleton loaders y count-up en números.

## APIs externas (pendientes de conectar)

| Servicio | Uso | Estado |
|----------|-----|--------|
| Yahoo Finance | Precios de acciones | env listo |
| Anthropic Claude (haiku) | 3 todos del día | route `/api/todos/generate` con fallback |
| Garmin Connect | Sueño, HRV, pasos | env listo |
| Apple Health (Shortcuts → webhook) | Peso, calorías | pendiente |

## Roadmap (sprints)

1. ✅ Base: Next.js + Auth + Layout + Design System
2. ✅ Dashboard diario (todos manuales → IA)
3. Finanzas — Portafolio (Excel + Yahoo Finance)
4. Finanzas — Agencia + Personal
5. Disciplina & Hábitos
6. Colegio (+ Homework Hub)
7. Health (Garmin + Apple Shortcuts)
8. Progreso + scores automáticos
9. Polish, animaciones, mobile
10. Comida (opcional)
```
