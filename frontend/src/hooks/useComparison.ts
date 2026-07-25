'use client';

import { useContext } from 'react';
import { ComparisonContext } from '@/context/ComparisonContext';

export function useComparison() {
  const ctx = useContext(ComparisonContext);
  if (!ctx) throw new Error('useComparison must be used within a <ComparisonProvider>.');
  return ctx;
}
