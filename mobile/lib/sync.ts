import AsyncStorage from '@react-native-async-storage/async-storage';

const SYNC_QUEUE_KEY = 'invo_sync_queue';

export interface SyncItem {
  id: string;
  entityType: string;
  operation: 'create' | 'update' | 'delete';
  payload: any;
  createdAt: string;
  syncedAt: string | null;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
}

export async function addToSyncQueue(item: Omit<SyncItem, 'id' | 'createdAt' | 'syncedAt' | 'status'>): Promise<void> {
  const queue = await getSyncQueue();
  const newItem: SyncItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    syncedAt: null,
    status: 'pending',
  };
  queue.push(newItem);
  await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
}

export async function getSyncQueue(): Promise<SyncItem[]> {
  try {
    const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function updateSyncItemStatus(id: string, status: SyncItem['status']): Promise<void> {
  const queue = await getSyncQueue();
  const item = queue.find((i) => i.id === id);
  if (item) {
    item.status = status;
    if (status === 'synced') {
      item.syncedAt = new Date().toISOString();
    }
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  }
}

export async function clearSyncedItems(): Promise<void> {
  const queue = await getSyncQueue();
  const unsynced = queue.filter((i) => i.status !== 'synced');
  await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(unsynced));
}

export async function syncQueue(apiClient: any): Promise<{ synced: number; failed: number }> {
  const queue = await getSyncQueue();
  const pending = queue.filter((i) => i.status === 'pending');
  let synced = 0;
  let failed = 0;

  for (const item of pending) {
    try {
      await updateSyncItemStatus(item.id, 'syncing');
      const endpoint = `/api/v1/${item.entityType}`;
      if (item.operation === 'create') {
        await apiClient.post(endpoint, item.payload);
      } else if (item.operation === 'update') {
        await apiClient.put(`${endpoint}/${item.payload.id}`, item.payload);
      } else if (item.operation === 'delete') {
        await apiClient.delete(`${endpoint}/${item.payload.id}`);
      }
      await updateSyncItemStatus(item.id, 'synced');
      synced++;
    } catch {
      await updateSyncItemStatus(item.id, 'failed');
      failed++;
    }
  }

  return { synced, failed };
}

export function useSyncIndicator() {
  // This hook can be used in components to show sync status
  // It returns the count of pending items and a sync function
  return {
    pendingCount: 0,
    sync: async () => {
      const api = require('../../lib/api').default;
      return syncQueue(api);
    },
  };
}