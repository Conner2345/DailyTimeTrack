import { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { TimerDisplay } from '@/components/timer-display';
import { DailyStats } from '@/components/daily-stats';
import { SettingsModal } from '@/components/settings-modal';
import { DayByDayModal } from '@/components/day-by-day-modal';
import { TimeEditModal } from '@/components/time-edit-modal';
import { DarkModeToggle } from '@/components/dark-mode-toggle';
import { useTimer } from '@/hooks/use-timer';
import { useTimeTracking } from '@/hooks/use-time-tracking';
import { useDarkMode } from '@/hooks/use-dark-mode';
import { formatTime, getActiveDaysText } from '@/lib/time-utils';

export default function Home() {
  const { toast } = useToast();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const {
    timeEntries,
    settings,
    getCurrentBalance,
    getCurrentBalanceInSeconds,
    getTodayEntry,
    updateTimeUsage,
    updateSettings,
    editTimeEntry,
    resetAllData,
    exportData,
  } = useTimeTracking();

  const { isRunning, elapsedTime, toggleTimer, resetTimer, setOnTimeUpdate } = useTimer();

  const [showSettings, setShowSettings] = useState(false);
  const [showDayByDay, setShowDayByDay] = useState(false);
  const [showTimeEdit, setShowTimeEdit] = useState(false);
  const [showBalanceEdit, setShowBalanceEdit] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  // Set up timer callback to update time usage
  useEffect(() => {
    setOnTimeUpdate((minutes: number) => {
      updateTimeUsage(minutes);
    });
  }, [updateTimeUsage, setOnTimeUpdate]);

  const handleEditTime = (entryId: string) => {
    setEditingEntryId(entryId);
    setShowTimeEdit(true);
    setShowDayByDay(false);
  };

  const handleSaveTimeEdit = (adjustmentMinutes: number) => {
    if (editingEntryId) {
      editTimeEntry(editingEntryId, adjustmentMinutes);
      toast({
        title: 'Time Updated',
        description: `Balance adjusted by ${formatTime(Math.abs(adjustmentMinutes))}`,
      });
    }
    setEditingEntryId(null);
  };

  const handleExportData = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timetracker-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Data Exported',
        description: 'Your data has been downloaded as a JSON file',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your data',
        variant: 'destructive',
      });
    }
  };

  const handleResetData = () => {
    resetAllData();
    toast({
      title: 'Data Reset',
      description: 'All data has been cleared',
    });
  };

  const currentBalance = getCurrentBalance();
  const currentBalanceInSeconds = getCurrentBalanceInSeconds();
  const todayEntry = getTodayEntry();

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 min-h-screen shadow-lg relative">
      {/* Header */}
      <header className="bg-blue-600 dark:bg-blue-700 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Time Bank</h1>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-white"
            onClick={() => setShowSettings(true)}
            data-testid="button-open-settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 pb-20 space-y-6">
        <TimerDisplay
          currentBalance={currentBalance}
          currentBalanceInSeconds={currentBalanceInSeconds}
          elapsedTime={elapsedTime}
          isRunning={isRunning}
          onToggleTimer={toggleTimer}
          onResetTimer={resetTimer}
          onEditBalance={() => {
            setEditingEntryId(getTodayEntry()?.id || null);
            setShowBalanceEdit(true);
          }}
        />

        <DailyStats
          todayEntry={todayEntry}
          onOpenDayByDay={() => setShowDayByDay(true)}
        />

        {/* Quick Settings */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border dark:border-slate-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-gray-100">
            <SettingsIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Quick Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Daily Time Addition</span>
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
                onClick={() => setShowSettings(true)}
                data-testid="button-edit-daily-time"
              >
                {formatTime(settings.dailyTimeHours * 60 + settings.dailyTimeMinutes)}
                <SettingsIcon className="w-3 h-3 ml-2" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Active Days</span>
              <Button
                variant="outline"
                size="sm"
                className="px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300"
                onClick={() => setShowSettings(true)}
                data-testid="button-edit-active-days"
              >
                {getActiveDaysText(settings.activeDays)}
                <SettingsIcon className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Dark Mode Toggle */}
      <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />

      {/* Modals */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetData={handleResetData}
        onExportData={handleExportData}
      />

      <DayByDayModal
        isOpen={showDayByDay}
        onClose={() => setShowDayByDay(false)}
        timeEntries={timeEntries}
        onEditTime={handleEditTime}
      />

      <TimeEditModal
        isOpen={showTimeEdit}
        onClose={() => setShowTimeEdit(false)}
        onSave={handleSaveTimeEdit}
      />

      <TimeEditModal
        isOpen={showBalanceEdit}
        onClose={() => setShowBalanceEdit(false)}
        onSave={(adjustmentMinutes: number) => {
          if (editingEntryId) {
            editTimeEntry(editingEntryId, adjustmentMinutes);
            toast({
              title: 'Balance Updated',
              description: `Balance adjusted by ${formatTime(Math.abs(adjustmentMinutes))}`,
            });
          }
          setEditingEntryId(null);
          setShowBalanceEdit(false);
        }}
      />
    </div>
  );
}
