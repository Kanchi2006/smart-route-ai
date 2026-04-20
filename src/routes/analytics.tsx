import { createFileRoute, Link } from "@tanstack/react-router";
import { Sidebar } from "@/components/Sidebar";
import { Construction } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  component: () => (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="glass-card p-10 max-w-2xl mx-auto text-center mt-20">
          <Construction className="size-12 text-accent mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground mb-6">Deep analytics view coming soon.</p>
          <Link to="/" className="inline-block cta-gradient px-5 py-2.5 rounded-xl font-semibold text-accent-foreground">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  ),
});
