import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface APIKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export const APIKeyInput = ({ apiKey, onApiKeyChange }: APIKeyInputProps) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          OpenAI API Key
        </CardTitle>
        <CardDescription>
          Enter your OpenAI API key to generate code snippets. Your key is stored securely in your browser session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="sk-..."
              className="font-mono pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <Alert>
          <AlertDescription className="text-xs">
            <strong>Security Note:</strong> For production use, we recommend connecting to Supabase for secure API key storage. 
            This frontend-only approach stores your key in browser memory for the current session only.
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Don't have an API key?</span>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
              Get one from OpenAI
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};