import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { UserCircle2 } from "lucide-react";

const Nav = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between p-4 border-b border-border">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="PromptByte" className="w-8 h-8" />
        <span className="text-xl font-bold text-primary">PromptByte</span>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-accent"
          onClick={() => navigate("/profile")}
        >
          <UserCircle2 className="w-6 h-6" />
        </Button>
      </div>
    </nav>
  );
};

export default Nav;
