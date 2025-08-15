import { Play, Pause, Square, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime, formatTimeWithSeconds } from '@/lib/time-utils';

interface TimerDisplayProps {
  currentBalance: number;
  elapsedTime: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onEditBalance: () => void;
}

export function TimerDisplay({ 
  currentBalance, 
  elapsedTime, 
  isRunning, 
  onToggleTimer, 
  onResetTimer,
  onEditBalance 
}: TimerDisplayProps) {
  const elapsedMinutes = Math.floor(elapsedTime / 60);
  const displayBalance = currentBalance - elapsedMinutes;
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl shadow-lg">
      <div className="mb-4">
        <div className="flex items-center justify-center mb-2">
          <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Current Balance
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 p-1 h-6 w-6"
            onClick={onEditBalance}
            data-testid="button-edit-balance"
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>
        <div className="text-6xl font-bold mb-2" data-testid="balance-display">
          <span className={displayBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {formatTime(displayBalance)}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400" data-testid="date-display">
          {today}
        </p>
        {elapsedTime > 0 && (
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1" data-testid="elapsed-time">
            Session: {formatTimeWithSeconds(elapsedTime)}
          </p>
        )}
      </div>
      
      <div className="flex justify-center space-x-4 mt-6">
        <Button
          size="lg"
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-full shadow-lg transition-all transform active:scale-95"
          onClick={onToggleTimer}
          data-testid="button-toggle-timer"
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </Button>
        <Button
          size="lg"
          className="w-16 h-16 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-full shadow-lg transition-all transform active:scale-95"
          onClick={onResetTimer}
          data-testid="button-reset-timer"
        >
          <Square className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
