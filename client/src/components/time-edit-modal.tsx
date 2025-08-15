import { useState } from 'react';
import { Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (adjustmentMinutes: number) => void;
}

export function TimeEditModal({ isOpen, onClose, onSave }: TimeEditModalProps) {
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);

  const handleSave = () => {
    const totalMinutes = hours * 60 + minutes;
    const adjustment = operation === 'add' ? totalMinutes : -totalMinutes;
    onSave(adjustment);
    onClose();
    // Reset form
    setOperation('add');
    setHours(0);
    setMinutes(30);
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setOperation('add');
    setHours(0);
    setMinutes(30);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto bg-white dark:bg-slate-800 border dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center text-gray-900 dark:text-gray-100">
            <Clock className="w-5 h-5 mr-2" />
            Edit Time
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Adjust Time Balance
            </Label>
            <div className="flex items-center space-x-2">
              <Select value={operation} onValueChange={(value: 'add' | 'subtract') => setOperation(value)}>
                <SelectTrigger className="w-24 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add</SelectItem>
                  <SelectItem value="subtract">Subtract</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                className="w-16 text-center bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
                data-testid="input-edit-hours"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">hours</span>
              <Input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                min="0"
                max="59"
                className="w-16 text-center bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
                data-testid="input-edit-minutes"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">min</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600"
              onClick={handleCancel}
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
              data-testid="button-save-edit"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
