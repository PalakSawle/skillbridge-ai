import React from 'react';
import { LogOut, LayoutDashboard, History, ShieldAlert, FileText, Sun, Moon } from 'lucide-react';

export default function Header({ user, currentTab, setCurrentTab, onLogout, isDarkMode, setIsDarkMode }) {
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="border-b border-dark-800 bg-dark-950/60 backdrop-blur-md sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('analyze')}>
            <span className="text-2xl">🌉</span>
            <span className="font-extrabold text-xl tracking-tight text-white">
              SKILLBRIDGE <span className="text-brand-500">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('analyze')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                currentTab === 'analyze'
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-dark-300 hover:text-white hover:bg-dark-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              Analyze
            </button>
            <button
              onClick={() => setCurrentTab('history')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                currentTab === 'history'
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-dark-300 hover:text-white hover:bg-dark-900'
              }`}
            >
              <History className="w-4 h-4" />
              Reports History
            </button>
            
            <button
              onClick={() => setCurrentTab('admin')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                currentTab === 'admin'
                  ? 'bg-brand-500/10 text-brand-400'
                  : 'text-dark-300 hover:text-white hover:bg-dark-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Placement Cell {user?.role === 'admin' && <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-brand-500 text-white">Admin</span>}
            </button>
          </nav>

          <div className="flex items-center gap-4">
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-dark-800 bg-dark-900/50 hover:bg-dark-900 text-dark-300 hover:text-white transition-all"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user && (
              <div className="flex items-center gap-3 border-l border-dark-800 pl-4">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-white">{user.name}</div>
                  <div className="text-[10px] text-dark-400 capitalize">{user.role} Account</div>
                </div>
                
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 active:scale-95 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
