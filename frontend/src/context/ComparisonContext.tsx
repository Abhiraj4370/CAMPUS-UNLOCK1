'use client';

import { createContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { COMPARE_STORAGE_KEY, MAX_COMPARE } from '@/lib/constants';

interface ComparisonContextValue {
  compareIds: string[];
  isComparing: (id: string) => boolean;
  toggleCompare: (id: string) => { added: boolean; limitReached: boolean };
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

export const ComparisonContext = createContext<ComparisonContextValue | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(COMPARE_STORAGE_KEY);
      if (raw) setCompareIds(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareIds));
  }, [compareIds, hydrated]);

  const isComparing = useCallback((id: string) => compareIds.includes(id), [compareIds]);

  const toggleCompare = useCallback((id: string) => {
    let added = false;
    let limitReached = false;
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_COMPARE) {
        limitReached = true;
        return prev;
      }
      added = true;
      return [...prev, id];
    });
    return { added, limitReached };
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  return (
    <ComparisonContext.Provider value={{ compareIds, isComparing, toggleCompare, removeFromCompare, clearCompare }}>
      {children}
    </ComparisonContext.Provider>
  );
}
