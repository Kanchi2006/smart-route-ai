import { useState } from "react";
import { Rocket, ShieldCheck, Loader2 } from "lucide-react";
import { CityAutocomplete } from "./CityAutocomplete";
import type { City } from "@/types";

interface Props {
  loading: boolean;
  error: string | null;
  onTrack: (source: string, destination: string) => void;
}

export function TrackingPanel({ loading, error, onTrack }: Props) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const handleSelectSrc = (c: City) => setSource(`${c.name}, ${c.state}`);
  const handleSelectDst = (c: City) => setDestination(`${c.name}, ${c.state}`);

  const submit = () => {
    if (!source || !destination || loading) return;
    onTrack(source, destination);
  };

  return (
    <aside className="w-full xl:w-[380px] shrink-0">
      <div className="glass-card-elevated p-6 xl:sticky xl:top-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h2 className="font-display text-xl font-semibold flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#06b6d4] flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.3)]">
              <Rocket className="size-4 text-white" />
            </div>
            Track Shipment
          </h2>
          <p className="text-sm text-text-muted mt-1.5">
            Enter source &amp; destination for AI-powered logistics insights.
          </p>
        </div>

        {/* Inputs */}
        <CityAutocomplete
          label="Source Location"
          value={source}
          onChange={setSource}
          onSelect={handleSelectSrc}
        />
        <CityAutocomplete
          label="Destination Location"
          value={destination}
          onChange={setDestination}
          onSelect={handleSelectDst}
        />

        {/* Error */}
        {error && (
          <div className="text-sm text-risk-high bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl px-4 py-2.5">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={submit}
          disabled={loading || !source || !destination}
          className="btn-primary w-full py-3.5 flex items-center justify-center gap-2.5 text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Analyzing route…
            </>
          ) : (
            <>
              <Rocket className="size-5" />
              Track Shipment
            </>
          )}
        </button>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
          <ShieldCheck className="size-3.5" />
          Your data is secure and encrypted.
        </div>
      </div>
    </aside>
  );
}
