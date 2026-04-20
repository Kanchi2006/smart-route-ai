CREATE TABLE public.shipments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  destination TEXT NOT NULL,
  source_lat DOUBLE PRECISION NOT NULL,
  source_lng DOUBLE PRECISION NOT NULL,
  dest_lat DOUBLE PRECISION NOT NULL,
  dest_lng DOUBLE PRECISION NOT NULL,
  distance_km DOUBLE PRECISION NOT NULL DEFAULT 0,
  weather TEXT NOT NULL DEFAULT 'Clear',
  weather_temp DOUBLE PRECISION,
  traffic TEXT NOT NULL DEFAULT 'Low',
  risk TEXT NOT NULL DEFAULT 'Low',
  status TEXT NOT NULL DEFAULT 'On Time',
  reason TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shipments"
  ON public.shipments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert shipments"
  ON public.shipments FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_shipments_created_at ON public.shipments (created_at DESC);