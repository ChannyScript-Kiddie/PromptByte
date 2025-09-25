import { useState } from "react";
import { PromptInput } from "./PromptInput";
import { CodeDisplay } from "./CodeDisplay";
import { useToast } from "@/hooks/use-toast";

interface GeneratedCode {
  code: string;
  language: string;
  title: string;
}

export const CodeGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(
    null
  );
  const { toast } = useToast();

  const generateCode = async (prompt: string) => {
    setLoading(true);

    try {
      // Check for Gemini API key
      const apiKey =
        (import.meta as any).env?.VITE_GEMINI_API_KEY ||
        localStorage.getItem("GEMINI_API_KEY");

      if (!apiKey) {
        throw new Error(
          "Gemini API key missing. Set VITE_GEMINI_API_KEY or localStorage.GEMINI_API_KEY"
        );
      }

      const systemPrompt = `Generate clean, functional code based on the user's request. 
Respond with a JSON object in this exact format:
{"code": "your_code_here", "language": "html|css|javascript|jsx", "title": "Brief title"}

Make the code complete, modern, and ready to use.

User request: ${prompt}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: systemPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              topK: 1,
              topP: 1,
              maxOutputTokens: 1000,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini API Error: ${response.status} ${errorData}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error("No response from Gemini");
      }

      // Parse JSON response
      let result: GeneratedCode;
      try {
        // Clean up response - remove markdown code blocks if present
        let cleanContent = content.trim();
        cleanContent = cleanContent.replace(/```json\n?/g, "");
        cleanContent = cleanContent.replace(/```\n?/g, "");

        result = JSON.parse(cleanContent);
      } catch {
        // Fallback if JSON parsing fails
        const language = detectLanguage(prompt);
        result = {
          code: content,
          language,
          title: `Generated ${language.toUpperCase()} Code`,
        };
      }

      setGeneratedCode(result);

      toast({
        title: "Code Generated!",
        description: "Your code has been generated successfully using Gemini.",
      });
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error ? error.message : "Failed to generate code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const detectLanguage = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes("css") || lowerPrompt.includes("style"))
      return "css";
    if (lowerPrompt.includes("react") || lowerPrompt.includes("jsx"))
      return "jsx";
    if (lowerPrompt.includes("javascript") || lowerPrompt.includes("js"))
      return "javascript";
    return "html";
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
            PROMPTBYTE
          </h1>
          <div className="text-xl text-foreground font-mono">
            <span className="text-accent"></span> AI Code Generator Assistant
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-mono">
            <span className="text-primary"></span> Input prompt to generate
            code.
            <br />
            <span className="text-accent"></span> HTML | CSS | JavaScript |
            React.Js supported.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card/50 border border-primary/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-sm text-primary font-mono mb-2">
                <span className="text-accent"></span> Ready for commands...
              </div>
              <PromptInput onSubmit={generateCode} loading={loading} />
            </div>
          </div>

          <div className="lg:sticky lg:top-6">
            <div className="bg-card/50 border border-primary/30 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-primary font-mono p-4 border-b border-primary/30">
                <span className="text-accent"></span> Generated code will appear
                here...
              </div>
              <CodeDisplay
                code={generatedCode?.code || ""}
                language={generatedCode?.language || "javascript"}
                title={generatedCode?.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
