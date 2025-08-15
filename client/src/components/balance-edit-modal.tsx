import { useState } from 'react';
import { Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BalanceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (adjustmentMinutes: number) => void;
  onSetAbsolute: (absoluteMinutes: number) => void;
  currentBalance: number; // in minutes
}

export function BalanceEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onSetAbsolute, 
  currentBalance 
}: BalanceEditModalProps) {
  // Adjustment tab state
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [adjustHours, setAdjustHours] = useState(0);
  const [adjustMinutes, setAdjustMinutes] = useState(30);

  // Set absolute tab state
  const [absoluteHours, setAbsoluteHours] = useState(Math.max(0, Math.floor(currentBalance / 60)));
  const [absoluteMinutes, setAbsoluteMinutes] = useState(Math.max(0, currentBalance % 60));
  const [isNegative, setIsNegative] = useState(currentBalance < 0);

  const handleAdjustmentSave = () => {
    const totalMinutes = adjustHours * 60 + adjustMinutes;
    const adjustment = operation === 'add' ? totalMinutes : -totalMinutes;
    onSave(adjustment);
    onClose();
    resetForm();
  };

  const handleAbsoluteSave = () => {
    const totalMinutes = absoluteHours * 60 + absoluteMinutes;
    const finalMinutes = isNegative ? -totalMinutes : totalMinutes;
    const adjustmentNeeded = finalMinutes - currentBalance;
    onSetAbsolute(adjustmentNeeded);
    onClose();
    resetForm();
  };

  const handleCancel = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setOperation('add');
    setAdjustHours(0);
    setAdjustMinutes(30);
    setAbsoluteHours(Math.max(0, Math.floor(Math.abs(currentBalance) / 60)));
    setAbsoluteMinutes(Math.max(0, Math.abs(currentBalance) % 60));
    setIsNegative(currentBalance < 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto bg-white dark:bg-slate-800 border dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center text-gray-900 dark:text-gray-100">
            <Clock className="w-5 h-5 mr-2" />
            Edit Balance
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="adjust" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="adjust">Adjust</TabsTrigger>
            <TabsTrigger value="set">Set Time</TabsTrigger>
          </TabsList>
          
          <TabsContent value="adjust" className="space-y-4">
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
                  value={adjustHours}
                  onChange={(e) => setAdjustHours(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  className="w-16 text-center bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
                  data-testid="input-adjust-hours"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">h</span>
                <Input
                  type="number"
                  value={adjustMinutes}
                  onChange={(e) => setAdjustMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  min="0"
                  max="59"
                  className="w-16 text-center bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
                  data-testid="input-adjust-minutes"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">m</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600"
                onClick={handleCancel}
                data-testid="button-cancel-adjust"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAdjustmentSave}
                data-testid="button-save-adjust"
              >
                Save
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="set" className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Set Absolute Time
              </Label>
              <div className="flex items-center space-x-2">
                <Select 
                  value={isNegative ? "negative" : "positive"} 
                  onValueChange={(value) => setIsNegative(value === "negative")}
                >
                  <SelectTrigger className="w-20 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="positive">+</SelectItem>
                    <SelectItem value="negative">-</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={absoluteHours}
                  onChange={(e) => setAbsoluteHours(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  className="w-16 text-center bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
                  data-testid="input-absolute-hours"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">h</span>
                <Input
                  type="number"
                  value={absoluteMinutes}
                  onChange={(e) => setAbsoluteMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                  min="0"
                  max="59"
                  className="w-16 text-center bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
                  data-testid="input-absolute-minutes"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">m</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Current balance: {currentBalance >= 0 ? '+' : ''}{Math.floor(Math.abs(currentBalance) / 60)}h {Math.abs(currentBalance) % 60}m
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600"
                onClick={handleCancel}
                data-testid="button-cancel-set"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleAbsoluteSave}
                data-testid="button-save-set"
              >
                Set Time
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}