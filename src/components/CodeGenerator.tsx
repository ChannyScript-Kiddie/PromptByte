import { useState } from "react";
import { PromptInput } from "./PromptInput";
import { CodeDisplay } from "./CodeDisplay";
import { useToast } from "@/hooks/use-toast";
import ComponentFetcher from "./ComponentFetcher.jsx";
import { parseUserInput } from "@/lib/parseUserInput";
import { fetchComponentByName } from "@/integrations/supabase/supabaseClient";

export const CodeGenerator = () => {
  const [mode, setMode] = useState("PromptByte 1.0");
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [output, setOutput] = useState({
    code: "",
    language: "bash",
  });
  const { toast } = useToast();
  // For PromptByte 2.0: store last parsed result
  const [dbComponentName, setDbComponentName] = useState<string>("");
  const [dbComponentProps, setDbComponentProps] = useState<Record<string, any>>(
    {}
  );
  // Error state for PromptByte 2.0
  const [dbComponentError, setDbComponentError] = useState<string>("");

  const handleGenerateCode = async (prompt: string) => {
    if (!prompt.trim()) return;
    setLoading(true);
    setHasGenerated(true);

    try {
      if (mode === "PromptByte 2.0") {
        const { component, props } = parseUserInput(prompt);
        if (component) {
          const result = await fetchComponentByName(component);
          setOutput({
            code: result?.code || "",
            language: "html",
          });
        }
      } else {
        const apiKey =
          (import.meta as any).env?.VITE_GEMINI_API_KEY ||
          localStorage.getItem("GEMINI_API_KEY");

        if (!apiKey) {
          throw new Error(
            "Gemini API key missing. Set VITE_GEMINI_API_KEY or localStorage.GEMINI_API_KEY"
          );
        }

        const systemInstruction = {
          parts: [
            {
              text: `You are a world-class code generator. Your sole purpose is to convert user requests into clean, functional code. You MUST respond ONLY with the complete, modern, and ready-to-use code block. Do NOT include any explanatory text, markdown formatting, or JSON wrappers.`,
            },
          ],
        };

        const modifiedPrompt = `${prompt}\n\nIMPORTANT: Do not include any comments, docstrings, or explanatory text in the code. Only provide the raw code itself.`;

        const STABLE_MODEL_ALIAS = "gemini-2.5-pro";

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${STABLE_MODEL_ALIAS}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: modifiedPrompt }] }],
              systemInstruction: systemInstruction,
              generationConfig: {
                temperature: 0.2,
                topK: 1,
                topP: 1,
                maxOutputTokens: 2048,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(
            `PromptByte API Error: ${response.status} ${errorData}`
          );
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

        // --- FIX: Improved error handling for an empty response ---
        if (!content || content.trim() === "") {
          throw new Error(
            "The API returned an empty response. Try a different prompt."
          );
        }

        // --- Make the output format better
        const cleanCode = content
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/```$/gi, "")
          .trim();

        const language = detectLanguage(prompt);

        setOutput({
          code: cleanCode,
          language,
        });

        toast({
          title: "Code Generated!",
          description:
            "Your code has been generated successfully using PromptByte.",
        });
      }
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
    if (lowerPrompt.includes("python") || lowerPrompt.includes("py"))
      return "python";
    return "html"; //fallbacks
  };

  // Reset output when switching modes or clearing input
  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    setHasGenerated(false);
    setOutput({ code: "", language: "bash" });
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
            React.Js | Python supported
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card/50 border border-primary/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-primary font-mono">
                  <span className="text-accent"></span> Ready for commands...
                </div>
                <select
                  value={mode}
                  onChange={(e) => handleModeChange(e.target.value)}
                  className="ml-2 px-2 py-1 rounded border border-primary bg-background text-primary font-mono text-xs focus:outline-none focus:ring focus:ring-primary"
                >
                  <option value="PromptByte 1.0">PromptByte 1.0</option>
                  <option value="PromptByte 2.0">PromptByte 2.0</option>
                </select>
              </div>
              {mode === "PromptByte 1.0" ? (
                <PromptInput onSubmit={handleGenerateCode} loading={loading} />
              ) : (
                <PromptInput
                  loading={loading}
                  onSubmit={async (prompt) => {
                    setLoading(true);
                    setDbComponentName("");
                    setDbComponentProps({});
                    setDbComponentError("");
                    try {
                      // Smart natural language parsing
                      const parsed = parseUserInput(prompt);
                      if (!parsed.component) {
                        setDbComponentError(
                          "Could not understand your request. Try describing the UI component more clearly."
                        );
                        setLoading(false);
                        return;
                      }
                      setDbComponentName(parsed.component);
                      setDbComponentProps(parsed.props);
                      toast({
                        title: "PromptByte 2.0 Parsed!",
                        description: `Component: ${parsed.component}`,
                      });
                    } catch (error) {
                      setDbComponentError("Error parsing prompt. Try again.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-6">
            <div className="bg-card/50 border border-primary/30 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-primary font-mono p-4 border-b border-primary/30">
                <span className="text-accent"></span> Generated code will appear
                here...
              </div>
              {mode === "PromptByte 1.0" ? (
                <CodeDisplay
                  code={output?.code || ""}
                  language={output?.language || "javascript"}
                />
              ) : (
                <div className="border border-primary/20 rounded-lg p-2 bg-card/80 mt-4">
                  <span className="text-xs text-primary font-mono">
                    AI Detected: {dbComponentName || "(none)"}
                  </span>
                  {dbComponentError && (
                    <div className="text-xs text-red-500 mt-2 font-mono">
                      {dbComponentError}
                    </div>
                  )}
                  <div className="mt-2">
                    {dbComponentName ? (
                      <ComponentFetcher
                        name={dbComponentName}
                        props={dbComponentProps}
                      />
                    ) : (
                      <div className="text-muted-foreground text-xs font-mono">
                        Enter a prompt to generate a component.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
