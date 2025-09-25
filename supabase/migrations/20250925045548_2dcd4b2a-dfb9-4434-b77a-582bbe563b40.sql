-- Create a settings table to store the OpenAI API key
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT NOT NULL UNIQUE,
  key_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read settings (for the edge function)
CREATE POLICY "Settings are readable by service role" 
ON public.settings 
FOR SELECT 
USING (true);

-- Insert the OpenAI API key
INSERT INTO public.settings (key_name, key_value) 
VALUES ('OPENAI_API_KEY', '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');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();