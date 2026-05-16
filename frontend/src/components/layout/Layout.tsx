import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Zap,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
];

export const Layout = () => {
  const { user, clearAuth } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={clsx(
        'flex flex-col h-full bg-white dark:bg-surface-card border-r border-gray-200 dark:border-surface-border',
        mobile ? 'w-64' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200 dark:border-surface-border">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
          SmartLeads
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-hover hover:text-gray-900 dark:hover:text-gray-200'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-200 dark:border-surface-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg mb-2">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.name}
            </p>
            <div className="flex items-center gap-1">
              <Shield size={11} className="text-brand-500" />
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full z-50">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-white dark:bg-surface-card border-b border-gray-200 dark:border-surface-border">
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-hover"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} className="text-gray-600 dark:text-gray-400" />
          </button>

          <div className="flex-1" />

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-hover transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun size={18} className="text-yellow-500" />
            ) : (
              <Moon size={18} className="text-gray-600" />
            )}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-surface p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
