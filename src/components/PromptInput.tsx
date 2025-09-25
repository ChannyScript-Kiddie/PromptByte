import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
}

export const PromptInput = ({ onSubmit, loading }: PromptInputProps) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onSubmit(prompt.trim());
    }
  };

  const examplePrompts = [
    "Create a responsive navigation bar with hamburger menu",
    "Generate a modern hero section with gradient background",
    "Build a contact form with validation",
    "Make a pricing cards component",
    "Create a responsive image gallery with lightbox"
  ];

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-2">
              Describe the code you want to generate
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a responsive navbar with dropdown menu..."
              className="min-h-[120px] resize-none font-mono"
              disabled={loading}
            />
          </div>
          
          <Button 
            type="submit" 
            variant="generate" 
            className="w-full" 
            disabled={!prompt.trim() || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Code
              </>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <p className="text-xs text-muted-foreground mb-3">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <Button
                key={index}
                variant="code"
                size="sm"
                onClick={() => setPrompt(example)}
                disabled={loading}
                className="text-xs"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};