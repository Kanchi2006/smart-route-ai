/**
 * Generate an AI explanation for a shipment's risk using Google Gemini.
 * Falls back to a template if the API key is missing or the call fails.
 */

interface ReasonParams {
  source: string;
  destination: string;
  weather: string;
  tempC: number | null;
  traffic: string;
  risk: string;
  status: string;
  distanceKm: number;
}

export async function generateReason(p: ReasonParams): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) return templateReason(p);

  try {
    const prompt = [
      `You are a logistics intelligence AI.`,
      `In ONE concise sentence (max 30 words), explain why a shipment`,
      `from ${p.source} to ${p.destination} (${p.distanceKm} km)`,
      `has risk="${p.risk}" and status="${p.status}".`,
      `Conditions: weather=${p.weather}${p.tempC !== null ? ` (${p.tempC}°C)` : ""},`,
      `traffic=${p.traffic}.`,
      `Be specific and human-readable. No preamble.`,
    ].join(" ");

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 80, temperature: 0.5 },
        }),
        signal: AbortSignal.timeout(12000),
      },
    );

    if (!res.ok) {
      console.error("Gemini API error:", res.status);
      return templateReason(p);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return text || templateReason(p);
  } catch (err) {
    console.error("Gemini exception:", err);
    return templateReason(p);
  }
}

function templateReason(p: ReasonParams): string {
  const factors: string[] = [];
  if (/(rain|thunder|snow)/i.test(p.weather)) factors.push(`${p.weather.toLowerCase()} conditions`);
  if (/(fog)/i.test(p.weather)) factors.push("foggy visibility");
  if (p.traffic === "High") factors.push("heavy traffic congestion");
  else if (p.traffic === "Medium") factors.push("moderate traffic");
  if (factors.length === 0) return "Clear weather and light traffic — delivery is on schedule.";
  return `Shipment is ${p.status.toLowerCase()} due to ${factors.join(" and ")} along the ${p.distanceKm} km route.`;
}
