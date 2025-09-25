import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Terminal, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import the PrismJS library for syntax highlighting
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';

interface CodeDisplayProps {
  code: string;
  language: string;
  title?: string;
}

export const CodeDisplay = ({ code, language, title }: CodeDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    if (!code) return;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "COPIED",
        description: "Code transferred to clipboard buffer.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "ERROR",
        description: "Clipboard access denied.",
        variant: "destructive",
      });
    }
  };

  const downloadCode = () => {
    if (!code) return;
    
    const extension = language === 'jsx' ? 'jsx' : 
                     language === 'javascript' ? 'js' :
                     language === 'css' ? 'css' : 'html';
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "DOWNLOADED",
      description: "Code file saved to downloads.",
    });
  };

  const highlightCode = (code: string, language: string) => {
    try {
      const grammar = Prism.languages[language] || Prism.languages.markup;
      return Prism.highlight(code, grammar, language);
    } catch {
      return code;
    }
  };

  if (!code) {
    return (
      <div className="p-4 space-y-4">
        <div className="code-block h-64 flex items-center justify-center text-muted-foreground font-mono">
          <div className="text-center space-y-2">
            <Terminal className="w-8 h-8 mx-auto text-primary animate-pulse" />
            <div>Waiting for input...</div>
            <div className="text-sm text-accent">Ready to generate code</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-mono">
          <span className="text-accent">[FILE]</span>{' '}
          <span className="text-primary">{title || `${language.toUpperCase()} Code`}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="font-mono text-xs bg-secondary/30 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-smooth"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 mr-1" />
                COPIED
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 mr-1" />
                COPY
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCode}
            className="font-mono text-xs bg-secondary/30 border-accent/30 text-accent hover:bg-accent/10 hover:border-accent transition-smooth"
          >
            <Download className="w-3 h-3 mr-1" />
            SAVE
          </Button>
        </div>
      </div>
      
      <div className="code-block">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-primary/30">
          <span className="text-xs uppercase tracking-wide text-primary font-mono">
            &gt; {language.toUpperCase()}
          </span>
          <span className="text-xs text-accent font-mono">
            {code.split('\n').length} lines
          </span>
        </div>
        <pre className="text-sm leading-relaxed overflow-x-auto">
          <code 
            className="font-mono"
            dangerouslySetInnerHTML={{ 
              __html: highlightCode(code, language) 
            }}
          />
        </pre>
      </div>
    </div>
  );
};