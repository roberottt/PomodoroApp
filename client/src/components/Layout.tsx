import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Bell, Brain } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-peach-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-coral to-pink rounded-full flex items-center justify-center">
                <Brain className="text-white w-4 h-4" />
              </div>
              <h1 className="text-xl font-bold text-charcoal">StudyBuddy</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-charcoal hover:text-coral transition-colors font-medium"
              >
                Panel
              </button>
              <button 
                onClick={() => {
                  const timerElement = document.querySelector('[data-section="timer"]');
                  timerElement?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-charcoal hover:text-coral transition-colors font-medium"
              >
                Temporizador
              </button>
              <button 
                onClick={() => {
                  const calendarElement = document.getElementById('calendar');
                  calendarElement?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-charcoal hover:text-coral transition-colors font-medium"
              >
                Calendario
              </button>
              <button 
                onClick={() => {
                  const analyticsElement = document.getElementById('analytics');
                  analyticsElement?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-charcoal hover:text-coral transition-colors font-medium"
              >
                Análisis
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-100">
                <Bell className="w-4 h-4 text-charcoal" />
              </Button>
              <div className="flex items-center space-x-2">
                <img 
                  src={user?.photoURL || "https://via.placeholder.com/32"} 
                  alt="User avatar" 
                  className="w-8 h-8 rounded-full" 
                />
                <span className="text-sm font-medium text-charcoal">{user?.displayName || "User"}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="text-charcoal hover:text-coral"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
