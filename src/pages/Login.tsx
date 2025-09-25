import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { signInWithEmail, signUpWithEmail, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);

  // Redirect automatically when session exists
  useEffect(() => {
    if (session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
        toast({ title: "Success", description: "Logged in." });
      } else {
        await signUpWithEmail(email, password);
        toast({
          title: "Success",
          description: "Account created and logged in.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Auth failed",
        description: err?.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-4 bg-card/50 border border-primary/30 rounded-lg p-6 backdrop-blur-sm"
      >
        <h1 className="text-2xl font-bold text-center">
          {mode === "login" ? "Login" : "Sign up"}
        </h1>
        <input
          className="w-full border rounded px-3 py-2 bg-background"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded px-3 py-2 bg-background"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-primary text-primary-foreground rounded px-3 py-2"
          disabled={submitting}
        >
          {submitting
            ? "Processing..."
            : mode === "login"
            ? "Login"
            : "Sign up"}
        </button>
        <button
          type="button"
          className="w-full border rounded px-3 py-2"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Create an account" : "Have an account? Login"}
        </button>
        <div className="text-center text-sm">
          <Link to="/" className="underline">
            Back to home
          </Link>
        </div>
      </form>
    </div>
  );
}
