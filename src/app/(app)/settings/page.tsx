import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardLabel } from "@/components/ui/Card";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { cn } from "@/lib/utils";

const integrations = [
  { name: "Supabase", env: "NEXT_PUBLIC_SUPABASE_URL", connected: isSupabaseConfigured },
  { name: "Anthropic (Claude)", env: "ANTHROPIC_API_KEY", connected: !!process.env.ANTHROPIC_API_KEY },
  { name: "Garmin Connect", env: "GARMIN_CLIENT_ID", connected: !!process.env.GARMIN_CLIENT_ID },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Settings" subtitle="Cuenta e integraciones." />

      <Card>
        <CardLabel>Integraciones</CardLabel>
        <div className="mt-4 space-y-3">
          {integrations.map((it) => (
            <div
              key={it.name}
              className="flex items-center justify-between border-b border-border-subtle pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm">{it.name}</p>
                <p className="mono text-xs text-text-muted">{it.env}</p>
              </div>
              <span
                className={cn(
                  "flex items-center gap-1.5 text-xs",
                  it.connected ? "text-success" : "text-text-muted"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    it.connected ? "bg-success" : "bg-text-muted"
                  )}
                />
                {it.connected ? "Conectado" : "Sin configurar"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardLabel>Cuenta</CardLabel>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm">Lucas</p>
            <p className="text-xs text-text-muted">Usuario único</p>
          </div>
          <LogoutButton />
        </div>
      </Card>
    </div>
  );
}
