import { useState } from 'react';
import { CodeDisplay } from './CodeDisplay';
import { PromptInput } from './PromptInput';
import { APIKeyInput } from './APIKeyInput';
import { useToast } from '@/hooks/use-toast';

interface GeneratedCode {
  code: string;
  language: string;
  title: string;
}

export const CodeGenerator = () => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const { toast } = useToast();

  const generateCode = async (prompt: string) => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a skilled web developer assistant. Generate clean, modern, and responsive code based on user requests. 

Rules:
1. Always return ONLY the code without explanations or markdown formatting
2. Use modern best practices (HTML5, CSS3, ES6+, React hooks)
3. Make code responsive and accessible
4. Use semantic HTML elements
5. Include proper CSS styling with modern techniques (flexbox, grid, etc.)
6. For React components, use functional components with hooks
7. Don't include import statements unless specifically requested
8. Focus on clean, readable, and maintainable code`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const code = data.choices[0]?.message?.content || '';
      
      // Detect language based on code content
      let language = 'javascript';
      let title = 'Generated Code';
      
      if (code.includes('<!DOCTYPE') || code.includes('<html')) {
        language = 'html';
        title = 'HTML Code';
      } else if (code.includes('function') || code.includes('const ') || code.includes('React')) {
        language = 'javascript';
        title = 'JavaScript/React Code';
      } else if (code.includes('{') && code.includes('}') && (code.includes('color:') || code.includes('margin:'))) {
        language = 'css';
        title = 'CSS Code';
      }

      setGeneratedCode({
        code: code.trim(),
        language,
        title
      });

      toast({
        title: "Code Generated Successfully!",
        description: "Your code snippet is ready to use.",
      });

    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate code. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Code Snippet Generator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Generate HTML, CSS, JavaScript, and React code snippets using AI. 
          Just describe what you want to build and get clean, modern code instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <APIKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />
          <PromptInput onSubmit={generateCode} loading={loading} />
        </div>
        
        <div>
          <CodeDisplay 
            code={generatedCode?.code || ''} 
            language={generatedCode?.language || 'javascript'}
            title={generatedCode?.title}
          />
        </div>
      </div>
    </div>
  );
};