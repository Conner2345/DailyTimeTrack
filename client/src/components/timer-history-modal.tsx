import { History, Play, Pause, Square } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TimerEvent } from '@shared/schema';
import { formatDate } from '@/lib/time-utils';

interface TimerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: TimerEvent[];
}

export function TimerHistoryModal({ isOpen, onClose, events }: TimerHistoryModalProps) {
  const sortedEvents = events
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 20); // Show last 20 events

  const getEventIcon = (type: TimerEvent['type']) => {
    switch (type) {
      case 'start':
        return <Play className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'pause':
        return <Pause className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'resume':
        return <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <Square className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getEventText = (event: TimerEvent) => {
    const date = new Date(event.timestamp);
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });

    switch (event.type) {
      case 'start':
        return `Timer started at ${timeStr}`;
      case 'pause':
        const duration = event.sessionDuration ? Math.floor(event.sessionDuration / 60) : 0;
        const seconds = event.sessionDuration ? event.sessionDuration % 60 : 0;
        return `Timer paused at ${timeStr} (${duration}m ${seconds}s session)`;
      case 'resume':
        return `Timer resumed at ${timeStr}`;
      default:
        return `Unknown event at ${timeStr}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white dark:bg-slate-800 border dark:border-slate-700 max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center text-gray-900 dark:text-gray-100">
            <History className="w-5 h-5 mr-2" />
            Timer History
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-96 overflow-y-auto mt-4">
          {sortedEvents.length > 0 ? (
            sortedEvents.map((event) => {
              const eventDate = new Date(event.timestamp);
              return (
                <div
                  key={event.id}
                  className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                  data-testid={`event-${event.id}`}
                >
                  <div className="flex items-center space-x-3">
                    {getEventIcon(event.type)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {getEventText(event)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(eventDate)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No timer history yet</p>
              <p className="text-sm mt-1">Start using the timer to see your activity</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}