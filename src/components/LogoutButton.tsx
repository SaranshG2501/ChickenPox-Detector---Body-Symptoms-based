import { useAuth } from "@/contexts/AuthContext"; // Import useAuth from your context
import { toast } from "sonner"; // Import toast for notifications
import { Button } from "@/components/ui/button"; // Import your Button component

const LogoutButton = () => {
  const { logout } = useAuth(); // Get the logout function from the auth context

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      toast.success("Logged out successfully!"); // Show success message
    } catch (error) {
      console.error("Logout error:", error); // Log any errors
      toast.error("Failed to log out. Please try again."); // Show error message
    }
  };

  return (
    <Button
      variant="outline" // Use the outline variant to match the theme
      size="sm" // Use a small size for consistency
      onClick={handleLogout} // Call handleLogout on click
      className="text-gray-800 hover:text-black border-gray-600 hover:bg-gray-200" // Update colors to match the theme
    >
      Logout
    </Button>
  );
};

export default LogoutButton;