import { BarChart3, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/time-utils';
import { TimeEntry } from '@shared/schema';

interface DailyStatsProps {
  todayEntry?: TimeEntry;
  onOpenDayByDay: () => void;
}

export function DailyStats({ todayEntry, onOpenDayByDay }: DailyStatsProps) {
  const addedToday = todayEntry?.addedMinutes || 0;
  const usedToday = todayEntry?.usedMinutes || 0;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
        <BarChart3 className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
        Daily Usage
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Added Today</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-added-today">
            {formatTime(addedToday)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">Used Today</p>
          <p className="text-xl font-bold text-red-600 dark:text-red-400" data-testid="text-used-today">
            {formatTime(usedToday)}
          </p>
        </div>
      </div>

      <Button
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg font-medium transition-colors"
        onClick={onOpenDayByDay}
        data-testid="button-view-breakdown"
      >
        View Day-by-Day Breakdown
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
