
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="flex text-gray-800 hover:text-black border-gray-300 hover:bg-gray-200 transition-colors"
    >
      <LogOut className="h-4 w-4 mr-1.5 sm:mr-2" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
};

export default LogoutButton;
