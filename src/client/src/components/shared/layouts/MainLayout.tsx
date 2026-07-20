import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Timer, 
  GraduationCap, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LogOut,
  User,
  Plus
} from 'lucide-react';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
      localStorage.getItem('theme') === 'dark';
  });

  const location = useLocation();

  // Handle dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);


  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Plans', path: '/plans', icon: BookOpen },
    { name: 'Focus Session', path: '/focus', icon: Timer },
    { name: 'Interview', path: '/interview', icon: GraduationCap },
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/plans': return 'My Study Plans';
      case '/plan/new': return 'Create Plan';
      case '/focus': return 'Focus Session';
      case '/interview': return 'AI Examiner';
      default: return 'Recall AI';
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-200">
      
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-card shrink-0 h-screen sticky top-0">
        {/* Logo area */}
        <div className="h-16 flex items-center px-6 border-b border-border gap-2.5">
          <span className="text-2xl">🧠</span>
          <span className="font-bold text-lg tracking-tight bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Recall AI
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group cursor-pointer
                  ${isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                <Icon className="h-4.5 w-4.5 group-hover:scale-105 transition-transform" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer (Theme Toggle & Signout) */}
        <div className="p-4 border-t border-border space-y-1.5 bg-muted/20">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
          </button>
          
          <Link
            to="/login"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* ================= MOBILE SIDEBAR DRAWER ================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside 
            className="fixed inset-y-0 left-0 w-60 bg-card border-r border-border flex flex-col h-full animate-[slideIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🧠</span>
                <span className="font-bold text-lg tracking-tight bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                  Recall AI
                </span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 px-4 py-6 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group cursor-pointer
                      ${isActive 
                        ? 'bg-primary text-white' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile Sidebar Footer */}
            <div className="p-4 border-t border-border space-y-1.5 bg-muted/20">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
              </button>
              
              <Link
                to="/login"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>Sign Out</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Page Title */}
            <h2 className="text-lg font-semibold text-foreground tracking-tight">
              {getPageTitle()}
            </h2>
          </div>

          {/* Topbar Right Actions */}
          <div className="flex items-center gap-4">
            {location.pathname !== '/plan/new' && (
              <Link
                to="/plan/new"
                className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary/95 active:scale-[0.98] transition-transform cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Create Plan
              </Link>
            )}

            {/* Profile Avatar Trigger */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full border border-border bg-muted flex items-center justify-center text-sm font-medium text-foreground cursor-pointer">
                <User className="h-4 w-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="grow p-4 md:p-8 max-w-7xl w-full mx-auto animate-[fadeIn_0.3s_ease-out]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
