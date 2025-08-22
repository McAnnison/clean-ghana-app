import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Leaf, LogOut } from "lucide-react";

export default function Navigation() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-ghana-green rounded-lg flex items-center justify-center">
              <Leaf className="text-white text-lg" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Clean Ghana</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {user.profileImageUrl && (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="text-sm font-medium text-gray-700">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              size="sm"
              data-testid="button-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
