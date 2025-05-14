import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Mail, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  LogOut,
  PlusCircle
} from "lucide-react";
import { ComposeModal } from "../email/compose-modal";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  
  // Close mobile menu on location change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navItems: NavItem[] = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="mr-3 h-6 w-6 text-gray-500" /> },
    { label: "Compose Email", path: "/compose", icon: <Mail className="mr-3 h-6 w-6 text-gray-500" /> },
    { label: "Recipients", path: "/recipients", icon: <Users className="mr-3 h-6 w-6 text-gray-500" /> },
    { label: "Scheduled Emails", path: "/scheduled", icon: <Calendar className="mr-3 h-6 w-6 text-gray-500" /> },
    { label: "Analytics", path: "/analytics", icon: <BarChart3 className="mr-3 h-6 w-6 text-gray-500" /> },
    { label: "Settings", path: "/settings", icon: <Settings className="mr-3 h-6 w-6 text-gray-500" /> }
  ];

  const handleLogout = async () => {
    await logout();
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const openComposeModal = () => {
    setComposeModalOpen(true);
  };
  
  return (
    <>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity"
          onClick={toggleMobileMenu}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 lg:flex lg:flex-shrink-0 transition-all duration-300 transform`}>
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white h-full">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-dark">
              <h1 className="text-xl font-bold text-white">MailConnect</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                <Button
                  variant="default"
                  className="w-full flex items-center justify-center px-4 py-2 mb-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                  onClick={openComposeModal}
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Compose Email
                </Button>
                
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                      ${location === item.path 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary-dark flex items-center justify-center text-white font-semibold">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                  <p className="text-xs font-medium text-gray-500">{user?.gmailConnected ? "Gmail Connected" : "Gmail Not Connected"}</p>
                </div>
                <button 
                  className="ml-auto text-gray-400 hover:text-gray-600"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu toggle button (render outside the sidebar for access when sidebar is hidden) */}
      <button 
        className="lg:hidden fixed z-10 top-4 left-4 p-2 rounded-md bg-white shadow text-gray-500"
        onClick={toggleMobileMenu}
      >
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>
      
      {/* Compose Email Modal */}
      <ComposeModal isOpen={composeModalOpen} onClose={() => setComposeModalOpen(false)} />
    </>
  );
}
