import { useEffect, useMemo, useState, useRef } from "react";
import { MapPin, Search } from "lucide-react";
import { searchCities, type City } from "@/lib/india-cities";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSelect: (city: City) => void;
}

export function CityAutosuggest({ label, value, onChange, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchCities(value, 6), [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="space-y-2">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      <div className="relative">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary" />
          <input
            value={value}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(true);
            }}
            placeholder="Type a city…"
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-input/60 border border-glass-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>

        {open && results.length > 0 && (
          <div className="absolute z-30 mt-2 w-full glass-card overflow-hidden">
            <ul className="max-h-64 overflow-auto">
              {results.map((c) => (
                <li key={`${c.name}-${c.state}`}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelect(c);
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-primary/15 transition text-sm"
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground">, {c.state}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
