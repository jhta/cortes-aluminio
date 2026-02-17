import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SystemResult } from '@/src/utils/calculations';

const HISTORY_KEY = 'history_entries';

export interface HistoryEntry {
  id: string;
  description: string;
  date: string;
  systemId: string;
  systemName: string;
  width: number;
  height: number;
  results: SystemResult;
}

let cache: HistoryEntry[] | null = null;

async function loadCache(): Promise<HistoryEntry[]> {
  if (cache !== null) return cache;
  const json = await AsyncStorage.getItem(HISTORY_KEY);
  cache = json ? JSON.parse(json) : [];
  return cache!;
}

async function persist(entries: HistoryEntry[]): Promise<void> {
  cache = entries;
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

async function getAll(): Promise<HistoryEntry[]> {
  return loadCache();
}

async function save(entry: Omit<HistoryEntry, 'id' | 'date'>): Promise<HistoryEntry> {
  const entries = await loadCache();
  const newEntry: HistoryEntry = {
    ...entry,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  entries.unshift(newEntry);
  await persist(entries);
  return newEntry;
}

async function remove(id: string): Promise<void> {
  const entries = (await loadCache()).filter((e) => e.id !== id);
  await persist(entries);
}

async function clearAll(): Promise<void> {
  cache = [];
  await AsyncStorage.removeItem(HISTORY_KEY);
}

export const historyStorage = { getAll, save, remove, clearAll };
