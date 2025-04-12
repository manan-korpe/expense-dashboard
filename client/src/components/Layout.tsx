
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  CreditCard, 
  PieChart, 
  User, 
  Menu, 
  LogOut,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type NavItem = {
  label: string;
  icon: React.ElementType;
  href: string;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: Home, href: '/dashboard' },
  { label: 'Transactions', icon: CreditCard, href: '/transactions' },
  { label: 'Budget', icon: PieChart, href: '/budget' },
  { label: 'Profile', icon: User, href: '/profile' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pocket-softPurple to-white">
      {/* Top Navigation Bar */}
      <header className="w-full py-4 px-6 bg-white shadow-md z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 bg-pocket-purple rounded-full flex items-center justify-center"
            >
              <span className="text-white font-bold">P+</span>
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pocket-purple to-pocket-vivid bg-clip-text text-transparent">
              Pocket Plus
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://avatar.vercel.sh/${user.id}.png`} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="fixed inset-y-0 right-0 w-3/4 bg-white p-6 shadow-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <nav className="flex-1">
                <ul className="space-y-2">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Button
                        variant={location.pathname === item.href ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          location.pathname === item.href && "bg-pocket-purple hover:bg-pocket-vivid"
                        )}
                        onClick={() => {
                          navigate(item.href);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        {item.label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="pt-4">
                <Separator />
                <div className="py-4 flex items-center">
                  <Avatar className="h-10 w-10 mr-2">
                    <AvatarImage src={`https://avatar.vercel.sh/${user?.id || 'guest'}.png`} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'G'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  className="w-full" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Log out
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Side Navigation (desktop) */}
        <aside className="hidden md:flex w-64 flex-col bg-white shadow-lg p-4">
          <nav className="flex-1 py-8">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Button
                    variant={location.pathname === item.href ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      location.pathname === item.href && "bg-pocket-purple hover:bg-pocket-vivid"
                    )}
                    onClick={() => navigate(item.href)}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="pt-4">
            <Separator />
            <div className="py-4 flex items-center">
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.id || 'guest'}.png`} />
                <AvatarFallback>{user?.name?.charAt(0) || 'G'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user?.name || 'Guest'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Log out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto py-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
