import { useState, useEffect } from 'react';
import { TimeEntry, Settings } from '@shared/schema';
import { storage } from '@/lib/storage';
import { getDateString, shouldAddDailyTime, parseTimeInput } from '@/lib/time-utils';
import { nanoid } from 'nanoid';

export function useTimeTracking() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [settings, setSettings] = useState<Settings>(() => storage.getSettings());

  // Load initial data
  useEffect(() => {
    setTimeEntries(storage.getTimeEntries());
    
    // Check if we need to add daily time for today
    const today = new Date();
    const todayString = getDateString(today);
    const todayEntry = storage.getTimeEntry(todayString);
    
    if (!todayEntry && shouldAddDailyTime(today, settings.activeDays)) {
      addDailyTime(today);
    }
  }, []);

  const addDailyTime = (date: Date) => {
    const dateString = getDateString(date);
    const dailyMinutes = parseTimeInput(settings.dailyTimeHours, settings.dailyTimeMinutes);
    
    let existingEntry = storage.getTimeEntry(dateString);
    
    if (!existingEntry) {
      // Create new entry
      const newEntry: TimeEntry = {
        id: nanoid(),
        date: dateString,
        addedMinutes: dailyMinutes,
        usedMinutes: 0,
        balance: dailyMinutes,
        lastUpdated: Date.now(),
      };
      
      storage.updateTimeEntry(newEntry);
      setTimeEntries(prev => [...prev, newEntry]);
    } else if (existingEntry.addedMinutes === 0) {
      // Update existing entry that hasn't had daily time added yet
      const updatedEntry: TimeEntry = {
        ...existingEntry,
        addedMinutes: dailyMinutes,
        balance: existingEntry.balance + dailyMinutes,
        lastUpdated: Date.now(),
      };
      
      storage.updateTimeEntry(updatedEntry);
      setTimeEntries(prev => prev.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ));
    }
  };

  const getCurrentBalance = (): number => {
    const today = getDateString(new Date());
    const todayEntry = timeEntries.find(entry => entry.date === today);
    return todayEntry?.balance || 0;
  };

  const getTodayEntry = (): TimeEntry | undefined => {
    const today = getDateString(new Date());
    return timeEntries.find(entry => entry.date === today);
  };

  const updateTimeUsage = (minutes: number) => {
    const today = getDateString(new Date());
    let todayEntry = timeEntries.find(entry => entry.date === today);
    
    if (!todayEntry) {
      // Create entry for today if it doesn't exist
      todayEntry = {
        id: nanoid(),
        date: today,
        addedMinutes: 0,
        usedMinutes: 0,
        balance: 0,
        lastUpdated: Date.now(),
      };
    }

    const updatedEntry: TimeEntry = {
      ...todayEntry,
      usedMinutes: todayEntry.usedMinutes + minutes,
      balance: todayEntry.balance - minutes,
      lastUpdated: Date.now(),
    };

    // Handle negative balance rollover
    if (updatedEntry.balance < 0) {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = getDateString(nextDay);
      
      let nextDayEntry = timeEntries.find(entry => entry.date === nextDayString);
      const carryOver = Math.abs(updatedEntry.balance);
      
      if (!nextDayEntry) {
        nextDayEntry = {
          id: nanoid(),
          date: nextDayString,
          addedMinutes: 0,
          usedMinutes: 0,
          balance: carryOver, // Credit for next day
          lastUpdated: Date.now(),
        };
        
        storage.updateTimeEntry(nextDayEntry);
        setTimeEntries(prev => [...prev, nextDayEntry!]);
      } else {
        const updatedNextDay: TimeEntry = {
          ...nextDayEntry,
          balance: nextDayEntry.balance + carryOver,
          lastUpdated: Date.now(),
        };
        
        storage.updateTimeEntry(updatedNextDay);
        setTimeEntries(prev => prev.map(entry => 
          entry.id === updatedNextDay.id ? updatedNextDay : entry
        ));
      }
    }

    storage.updateTimeEntry(updatedEntry);
    setTimeEntries(prev => prev.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
  };

  const updateSettings = (newSettings: Settings) => {
    storage.setSettings(newSettings);
    setSettings(newSettings);
  };

  const editTimeEntry = (entryId: string, adjustmentMinutes: number) => {
    const entry = timeEntries.find(e => e.id === entryId);
    if (!entry) return;

    const updatedEntry: TimeEntry = {
      ...entry,
      balance: entry.balance + adjustmentMinutes,
      lastUpdated: Date.now(),
    };

    storage.updateTimeEntry(updatedEntry);
    setTimeEntries(prev => prev.map(e => 
      e.id === entryId ? updatedEntry : e
    ));
  };

  const resetAllData = () => {
    storage.clearAllData();
    setTimeEntries([]);
    setSettings(storage.getSettings());
  };

  const exportData = () => {
    return storage.exportData();
  };

  const getSortedEntries = () => {
    return [...timeEntries].sort((a, b) => b.date.localeCompare(a.date));
  };

  return {
    timeEntries: getSortedEntries(),
    settings,
    getCurrentBalance,
    getTodayEntry,
    updateTimeUsage,
    updateSettings,
    editTimeEntry,
    resetAllData,
    exportData,
  };
}
