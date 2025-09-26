import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Terminal, Zap } from "lucide-react";

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading: boolean;
}

export const PromptInput = ({ onSubmit, loading }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onSubmit(prompt.trim());
    }
  };

  const examplePrompts = [
    "responsive navbar with dropdown",
    "card component with hover effects",
    "contact form with validation",
    "image gallery grid",
    "dark mode toggle button",
  ];

  const handleExampleClick = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: give me a header of a website"
            className="min-h-[100px] bg-input/50 border-primary/30 focus:border-primary font-mono pt-2 text-foreground placeholder:text-muted-foreground backdrop-blur-sm"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-mono tracking-wider border border-primary/50 hover:shadow-glow-primary transition-smooth"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
              PROCESSING...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              EXECUTE
            </>
          )}
        </Button>
      </form>

      <div className="space-y-2">
        <p className="text-sm text-accent font-mono">&gt; Quick commands:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleExampleClick(example)}
              className="text-xs font-mono bg-secondary/30 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent transition-smooth"
              disabled={loading}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
