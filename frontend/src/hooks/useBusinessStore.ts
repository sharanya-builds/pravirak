import { useCallback, useEffect, useState } from 'react';
import { businessApi, SavedBusiness } from '../api/client';
import { useAuth } from '../context/AuthContext';

const GUEST_BUSINESSES_KEY = 'pravirak_guest_businesses';

function readGuestBusinesses(): SavedBusiness[] {
  try {
    const raw = localStorage.getItem(GUEST_BUSINESSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeGuestBusinesses(list: SavedBusiness[]) {
  localStorage.setItem(GUEST_BUSINESSES_KEY, JSON.stringify(list));
}

export function useBusinessStore() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<SavedBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      if (user) {
        const { businesses: list } = await businessApi.list();
        setBusinesses(list);
      } else {
        setBusinesses(readGuestBusinesses());
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveBusiness = useCallback(
    async (payload: Partial<SavedBusiness>) => {
      if (user) {
        const { business } = await businessApi.save(payload);
        setBusinesses((prev) => {
          const withoutExisting = prev.filter((b) => b.id !== business.id);
          return [business, ...withoutExisting];
        });
        return business;
      }

      const list = readGuestBusinesses();
      const now = new Date().toISOString();
      let saved: SavedBusiness;
      if (payload.id) {
        const idx = list.findIndex((b) => b.id === payload.id);
        saved = { ...(list[idx] || {}), ...payload, updatedAt: now } as SavedBusiness;
        if (idx >= 0) list[idx] = saved;
        else list.unshift(saved);
      } else {
        saved = {
          id: Date.now(),
          businessIdea: payload.businessIdea || '',
          category: payload.category || null,
          locationId: payload.locationId || null,
          locationName: payload.locationName || null,
          ownCapital: payload.ownCapital ?? null,
          status: payload.status || 'Draft',
          decision: payload.decision || null,
          snapshot: payload.snapshot ?? null,
          createdAt: now,
          updatedAt: now
        };
        list.unshift(saved);
      }
      writeGuestBusinesses(list);
      setBusinesses([...list]);
      return saved;
    },
    [user]
  );

  const removeBusiness = useCallback(
    async (id: number) => {
      if (user) {
        await businessApi.remove(id);
      } else {
        const list = readGuestBusinesses().filter((b) => b.id !== id);
        writeGuestBusinesses(list);
      }
      setBusinesses((prev) => prev.filter((b) => b.id !== id));
    },
    [user]
  );

  return { businesses, isLoading, refresh, saveBusiness, removeBusiness, isGuestStore: !user };
}
