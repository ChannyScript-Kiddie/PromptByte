import { CodeGenerator } from "@/components/CodeGenerator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import Nav from "@/components/Nav";

const Index = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          onClick={() => navigate("/profile")}
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
      <Nav />
      <CodeGenerator />
    </div>
  );
};

export default Index;
