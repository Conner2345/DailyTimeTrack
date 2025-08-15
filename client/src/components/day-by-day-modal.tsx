import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TimeEntry } from '@shared/schema';
import { formatTime, formatDate } from '@/lib/time-utils';

interface DayByDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeEntries: TimeEntry[];
  onEditTime: (entryId: string) => void;
}

export function DayByDayModal({ isOpen, onClose, timeEntries, onEditTime }: DayByDayModalProps) {
  const [displayCount, setDisplayCount] = useState(10);

  const sortedEntries = timeEntries
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, displayCount);

  const hasMore = timeEntries.length > displayCount;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white dark:bg-slate-800 border dark:border-slate-700 max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-gray-900 dark:text-gray-100">
            <Calendar className="w-5 h-5 mr-2" />
            Day-by-Day Usage
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-96 overflow-y-auto mt-4">
          {sortedEntries.map((entry) => {
            const entryDate = new Date(entry.date);
            return (
              <div
                key={entry.id}
                className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg"
                data-testid={`card-day-${entry.date}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(entryDate)}
                  </span>
                  <span
                    className={`font-bold ${
                      entry.balance >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                    data-testid={`text-balance-${entry.date}`}
                  >
                    {formatTime(entry.balance)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Added:</span>
                    <span data-testid={`text-added-${entry.date}`}>
                      {formatTime(entry.addedMinutes)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Used:</span>
                    <span data-testid={`text-used-${entry.date}`}>
                      {formatTime(entry.usedMinutes)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline p-0"
                  onClick={() => onEditTime(entry.id)}
                  data-testid={`button-edit-${entry.date}`}
                >
                  Edit Time
                </Button>
              </div>
            );
          })}

          {sortedEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No time entries yet</p>
              <p className="text-sm mt-1">Start the timer to create your first entry</p>
            </div>
          )}

          {hasMore && (
            <Button
              variant="ghost"
              className="w-full py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
              onClick={() => setDisplayCount(prev => prev + 10)}
              data-testid="button-load-more"
            >
              Load More Days
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
