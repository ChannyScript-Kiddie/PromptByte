import { CodeGenerator } from "@/components/CodeGenerator";
import { useAuth } from "@/hooks/useAuth.tsx";

const Index = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background relative">
      <button
        onClick={signOut}
        className="absolute top-4 right-4 bg-primary text-primary-foreground rounded px-3 py-2"
      >
        Logout
      </button>
      <CodeGenerator />
    </div>
  );
};

export default Index;
