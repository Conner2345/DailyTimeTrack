import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export function DarkModeToggle({ darkMode, onToggle }: DarkModeToggleProps) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <Button
        onClick={onToggle}
        className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
        data-testid="button-toggle-dark-mode"
      >
        {darkMode ? (
          <Sun className="w-4 h-4 text-yellow-500" />
        ) : (
          <Moon className="w-4 h-4 text-gray-600" />
        )}
        <span className="text-sm font-medium">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
        <div className={`w-10 h-6 rounded-full relative transition-colors ${
          darkMode ? 'bg-blue-600' : 'bg-gray-300'
        }`}>
          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
            darkMode ? 'left-5' : 'left-1'
          }`} />
        </div>
      </Button>
    </div>
  );
}
