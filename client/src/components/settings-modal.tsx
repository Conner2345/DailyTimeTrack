import { useState } from 'react';
import { X, Settings as SettingsIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from '@shared/schema';
import { getActiveDaysText } from '@/lib/time-utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
  onResetData: () => void;
  onExportData: () => void;
}

export function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  onUpdateSettings, 
  onResetData, 
  onExportData 
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onClose();
  };

  const handleDayToggle = (day: number) => {
    const newActiveDays = localSettings.activeDays.includes(day)
      ? localSettings.activeDays.filter(d => d !== day)
      : [...localSettings.activeDays, day].sort();
    
    setLocalSettings(prev => ({ ...prev, activeDays: newActiveDays }));
  };

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      onResetData();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-white dark:bg-slate-800 border dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center text-gray-900 dark:text-gray-100">
            <SettingsIcon className="w-5 h-5 mr-2" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Daily Time Setting */}
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Daily Time Addition
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={localSettings.dailyTimeHours}
                onChange={(e) => setLocalSettings(prev => ({ 
                  ...prev, 
                  dailyTimeHours: Math.max(0, Math.min(24, parseInt(e.target.value) || 0))
                }))}
                min="0"
                max="24"
                className="w-20 text-center bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
                data-testid="input-daily-hours"
              />
              <span className="text-gray-600 dark:text-gray-300">hours</span>
              <Input
                type="number"
                value={localSettings.dailyTimeMinutes}
                onChange={(e) => setLocalSettings(prev => ({ 
                  ...prev, 
                  dailyTimeMinutes: Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                }))}
                min="0"
                max="59"
                className="w-20 text-center bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
                data-testid="input-daily-minutes"
              />
              <span className="text-gray-600 dark:text-gray-300">minutes</span>
            </div>
          </div>

          {/* Active Days */}
          <div>
            <Label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Active Days
            </Label>
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day, index) => (
                <Button
                  key={index}
                  variant={localSettings.activeDays.includes(index) ? "default" : "outline"}
                  size="sm"
                  className={`aspect-square text-sm font-medium transition-colors ${
                    localSettings.activeDays.includes(index)
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600'
                  }`}
                  onClick={() => handleDayToggle(index)}
                  data-testid={`button-day-${index}`}
                >
                  {day}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2" data-testid="text-selected-days">
              Selected: {getActiveDaysText(localSettings.activeDays)}
            </p>
          </div>

          {/* Data Management */}
          <div>
            <Label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Data Management
            </Label>
            <div className="space-y-2">
              <Button
                variant="destructive"
                className="w-full text-sm font-medium"
                onClick={handleResetData}
                data-testid="button-reset-data"
              >
                Reset All Data
              </Button>
              <Button
                variant="outline"
                className="w-full text-sm font-medium bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600"
                onClick={onExportData}
                data-testid="button-export-data"
              >
                Export Data
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600"
              onClick={onClose}
              data-testid="button-cancel-settings"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
              data-testid="button-save-settings"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
