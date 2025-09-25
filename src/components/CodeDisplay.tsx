import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check } from 'lucide-react';

interface CodeDisplayProps {
  code: string;
  language: string;
  title?: string;
}

export const CodeDisplay = ({ code, language, title }: CodeDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (!code) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Generated code will appear here...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-mono text-muted-foreground">
          {title || `${language.toUpperCase()} Code`}
        </CardTitle>
        <Button
          variant="copy"
          size="sm"
          onClick={copyToClipboard}
          className="transition-smooth"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="code-block m-4">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              background: 'transparent',
              padding: 0,
              margin: 0,
            }}
            codeTagProps={{
              style: {
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              }
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
};