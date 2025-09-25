import { useState } from 'react';
import { PromptInput } from './PromptInput';
import { CodeDisplay } from './CodeDisplay';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedCode {
  code: string;
  language: string;
  title: string;
}

export const CodeGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const { toast } = useToast();

  const generateCode = async (prompt: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: { prompt }
      });

      if (error) {
        throw error;
      }

      setGeneratedCode(data);
      
      toast({
        title: "Code Generated!",
        description: "Your code snippet has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden">
      {/* Scanner line effect */}
      <div className="scanner-line" />
      
      {/* Matrix background effect */}
      <div className="matrix-bg">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent"
              style={{
                left: `${i * 5}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold terminal-text text-primary glitch-text">
            &gt; PROMPTBYTE_
          </h1>
          <div className="text-xl text-foreground font-mono">
            <span className="text-accent">[SYSTEM]</span> AI Code Generator Online
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-mono">
            <span className="text-primary">&gt;</span> Neural network activated. Input prompt to generate code.
            <br />
            <span className="text-accent">&gt;</span> HTML | CSS | JavaScript | React supported.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card/50 border border-primary/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm text-primary font-mono mb-2">
                <span className="text-accent">[INPUT_MODULE]</span> Ready for commands...
              </div>
              <PromptInput onSubmit={generateCode} loading={loading} />
            </div>
          </div>
          
          <div className="lg:sticky lg:top-6">
            <div className="bg-card/50 border border-primary/30 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-primary font-mono p-4 border-b border-primary/30">
                <span className="text-accent">[OUTPUT_TERMINAL]</span> Generated code will appear here...
              </div>
              <CodeDisplay 
                code={generatedCode?.code || ''} 
                language={generatedCode?.language || 'javascript'}
                title={generatedCode?.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};