import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { Settings as SettingsIcon } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: () => (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="glass-card p-10 max-w-2xl mx-auto mt-20">
          <SettingsIcon className="size-10 text-accent mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground mb-6">
            Powered by Lovable Cloud (Postgres + AI Gateway). Maps via Leaflet + OpenStreetMap. Weather via Open-Meteo. AI reasoning via Google Gemini.
          </p>
          <Link to="/" className="inline-block cta-gradient px-5 py-2.5 rounded-xl font-semibold text-accent-foreground">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  ),
});
