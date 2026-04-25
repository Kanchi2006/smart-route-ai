import { Settings as SettingsIcon, Key, Database, Globe } from "lucide-react";

export default function Settings() {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY ? "••••••••" : "Not configured";
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "Not configured";

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-3xl">
      <div className="flex items-center gap-3 pt-2 lg:pt-0">
        <SettingsIcon className="size-7 text-neon-purple" />
        <div>
          <h1 className="font-display text-2xl font-bold">Settings</h1>
          <p className="text-sm text-text-muted">Configuration &amp; API status</p>
        </div>
      </div>

      {/* API Status */}
      <div className="glass-card p-6 space-y-5 animate-fade-in">
        <h3 className="font-display text-base font-semibold">API Connections</h3>

        <div className="space-y-4">
          <StatusRow
            icon={<Key className="size-5 text-neon-cyan" />}
            label="Google Gemini AI"
            value={geminiKey}
            connected={!!import.meta.env.VITE_GEMINI_API_KEY}
            hint="Set VITE_GEMINI_API_KEY in .env"
          />
          <StatusRow
            icon={<Database className="size-5 text-neon-purple" />}
            label="Supabase Database"
            value={supabaseUrl}
            connected={!!import.meta.env.VITE_SUPABASE_URL}
            hint="Set VITE_SUPABASE_URL in .env"
          />
          <StatusRow
            icon={<Globe className="size-5 text-neon-blue" />}
            label="Open-Meteo Weather"
            value="api.open-meteo.com"
            connected={true}
            hint="Free API — no key required"
          />
          <StatusRow
            icon={<Globe className="size-5 text-risk-low" />}
            label="OSRM Routing"
            value="router.project-osrm.org"
            connected={true}
            hint="Free routing API — no key required"
          />
        </div>
      </div>

      {/* Environment Info */}
      <div className="glass-card p-6 space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <h3 className="font-display text-base font-semibold">Environment</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-text-muted">Mode</div>
          <div className="font-medium">{import.meta.env.MODE}</div>
          <div className="text-text-muted">Base URL</div>
          <div className="font-medium">{import.meta.env.BASE_URL}</div>
          <div className="text-text-muted">Hosting</div>
          <div className="font-medium">Firebase</div>
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  icon, label, value, connected, hint,
}: {
  icon: React.ReactNode; label: string; value: string; connected: boolean; hint: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-medium text-sm">{label}</span>
          <span
            className={`size-2 rounded-full ${connected ? "bg-risk-low shadow-[0_0_6px_#10b98180]" : "bg-risk-high shadow-[0_0_6px_#ef444480]"}`}
          />
        </div>
        <div className="text-xs text-text-muted truncate">{value}</div>
        <div className="text-xs text-text-muted mt-1 opacity-70">{hint}</div>
      </div>
    </div>
  );
}
