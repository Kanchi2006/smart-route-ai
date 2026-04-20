import { lazy, Suspense, useEffect, useState } from "react";

const ShipmentMap = lazy(() => import("./ShipmentMap"));

interface Props {
  shipment: any;
}

export function ShipmentMapLazy({ shipment }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-full h-[420px] rounded-xl bg-muted/30 animate-pulse" />
    );
  }

  return (
    <Suspense
      fallback={<div className="w-full h-[420px] rounded-xl bg-muted/30 animate-pulse" />}
    >
      <ShipmentMap shipment={shipment} />
    </Suspense>
  );
}
