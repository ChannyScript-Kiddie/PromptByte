import { Button } from "@/components/ui/button";
import { Card } from "../components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background p-8 flex items-center justify-center">
      <Card className="w-full max-w-md p-6 space-y-6 border border-border bg-card">
        <h1 className="text-3xl font-bold text-center text-primary terminal-text">
          Your Profile
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent">
            <span className="text-2xl text-accent">
              {session?.user?.email?.[0].toUpperCase()}
            </span>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              {session?.user?.email?.split("@")[0]}
            </h2>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Button
            variant="outline"
            className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </Button>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleSignOut}
          >
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
