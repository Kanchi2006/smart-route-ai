import { useState } from "react";
import { Rocket, ShieldCheck, Loader2 } from "lucide-react";
import { CityAutosuggest } from "./CityAutosuggest";
import type { City } from "@/lib/india-cities";

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
      <div className="glass-card p-6 xl:sticky xl:top-6 space-y-6">
        <div>
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2">
            <Rocket className="size-6 text-accent" />
            Track New Shipment
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Enter source and destination to get AI-powered logistics insights.
          </p>
        </div>

        <CityAutosuggest
          label="Source Location"
          value={source}
          onChange={setSource}
          onSelect={handleSelectSrc}
        />
        <CityAutosuggest
          label="Destination Location"
          value={destination}
          onChange={setDestination}
          onSelect={handleSelectDst}
        />

        {error && (
          <div className="text-sm text-risk-high bg-risk-high/10 border border-risk-high/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          onClick={submit}
          disabled={loading || !source || !destination}
          className="cta-gradient w-full py-3.5 rounded-xl font-semibold text-accent-foreground flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition hover:brightness-110"
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

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          Your data is secure and safe with us.
        </div>
      </div>
    </aside>
  );
}
