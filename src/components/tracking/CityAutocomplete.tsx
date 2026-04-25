import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import { searchCities } from "@/lib/india-cities";
import type { City } from "@/types";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onSelect: (city: City) => void;
}

export function CityAutocomplete({ label, value, onChange, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<City[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResults(searchCities(value, 6));
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="text-xs font-medium uppercase tracking-widest text-text-muted mb-1.5 block">
        {label}
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Type a city name…"
          className="input-field pl-10"
          autoComplete="off"
        />
      </div>

      {open && results.length > 0 && (
        <ul className="absolute z-50 mt-1.5 w-full max-h-52 overflow-y-auto rounded-xl bg-[#1a1726]/95 backdrop-blur-xl border border-white/[0.08] shadow-lg py-1">
          {results.map((city) => (
            <li key={`${city.name}-${city.state}`}>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.06] transition flex items-center gap-3"
                onClick={() => {
                  onSelect(city);
                  onChange(`${city.name}, ${city.state}`);
                  setOpen(false);
                }}
              >
                <MapPin className="size-3.5 text-neon-purple shrink-0" />
                <span className="font-medium">{city.name}</span>
                <span className="text-text-muted text-xs ml-auto">{city.state}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
