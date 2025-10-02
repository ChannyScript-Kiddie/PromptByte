import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchPromptHistory } from "@/integrations/supabase/promptHistory";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [history, setHistory] = useState<
    Array<{ id: string; prompt: string; created_at: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch prompt history when sidebar opens
  useEffect(() => {
    const fetchHistory = async () => {
      if (isOpen && session?.user?.id) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchPromptHistory(session.user.id);
          setHistory(data);
        } catch (err: any) {
          setError(err.message || "Failed to fetch history");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchHistory();
    // Only refetch when sidebar opens or user changes
  }, [isOpen, session?.user?.id]);

  // Copy prompt to clipboard
  const handleCopy = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({ title: "Copied!", description: "Prompt copied to clipboard." });
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy prompt.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300
                   ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-72 bg-background/95 z-50 shadow-lg 
                   transform transition-transform duration-300 ease-in-out
                   border-r border-primary/20 backdrop-blur-sm
                   ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          height: "100%",
          position: "fixed",
          top: 0,
          bottom: 0,
        }}
      >
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-primary/10">
          <div className="flex items-center justify-between p-4">
            <span className="font-mono text-primary text-lg font-bold">
              Prompt History
            </span>
            <button
              className="text-primary hover:text-primary/80 transition-colors p-1 hover:bg-background/10 rounded"
              onClick={onClose}
            >
              <img
                src="/close.svg"
                alt="Close"
                className="w-5 h-5 text-current"
                style={{ filter: "var(--svg-filter-primary)" }}
              />
            </button>
          </div>
        </div>
        <div
          className="p-4 text-xs text-muted-foreground overflow-y-auto"
          style={{
            height: "calc(100% - 65px)",
            position: "relative",
          }}
        >
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : history.length === 0 ? (
            <div>No prompt history found.</div>
          ) : (
            <ul className="space-y-2">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-primary/10 pb-2 flex flex-col gap-1"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="font-mono text-foreground whitespace-pre-line break-words flex-1"
                      style={{ wordBreak: "break-word" }}
                    >
                      {item.prompt}
                    </span>
                    <button
                      className="ml-1 p-1 rounded hover:bg-primary/10 text-primary text-xs border border-primary/20"
                      title="Copy prompt"
                      onClick={() => handleCopy(item.prompt)}
                    >
                      Copy
                    </button>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};
