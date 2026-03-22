/**
 * Firebase compatibility layer.
 * Provides the same API surface as the old Firebase functions,
 * but uses internal Next.js API routes backed by SQL Server.
 */

type Callback<T> = (data: T) => void;

// Collection-to-API mapping
const collectionApiMap: Record<string, string> = {
  bookings: '/api/admin/checkin',     // returns { bookings, users, trips, routes, buses }
  users: '/api/admin/checkin',
  trips: '/api/admin/checkin',
  routes: '/api/admin/checkin',
  buses: '/api/admin/checkin',
};

// Cache for the combined admin data (avoid multiple fetches for same data)
let cachedData: Record<string, unknown> | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 2000; // 2 seconds

async function fetchAdminData(): Promise<Record<string, unknown>> {
  const now = Date.now();
  if (cachedData && now - cacheTimestamp < CACHE_TTL) {
    return cachedData;
  }
  const res = await fetch('/api/admin/checkin');
  const data = await res.json();
  cachedData = data;
  cacheTimestamp = now;
  return data;
}

/**
 * Subscribe to a collection. Since SQL Server doesn't support realtime,
 * this fetches data once and calls the callback.
 * Returns an unsubscribe function (no-op).
 */
export function subscribeToCollection<T>(
  collectionName: string,
  callback: Callback<T>
): () => void {
  let cancelled = false;

  const fetchData = async () => {
    try {
      const data = await fetchAdminData();
      if (!cancelled) {
        callback((data[collectionName] || {}) as T);
      }
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
    }
  };

  fetchData();

  // Giảm tải polling cập nhật "live" (Đồng bộ Realtime) từ 10 giây xuống 30 giây để đỡ spam
  const interval = setInterval(fetchData, 30000);

  return () => {
    cancelled = true;
    clearInterval(interval);
  };
}

/**
 * Update a document. Maps Firebase paths to API calls.
 * Example: updateDocument('bookings/ABC123', { paid: true })
 */
export async function updateDocument(
  path: string,
  data: Record<string, unknown>
): Promise<void> {
  const [collection, id] = path.split('/');

  if (collection === 'bookings') {
    // Handle checkin update
    if (data.checkin !== undefined) {
      await fetch(`/api/bookings/${id}/checkin`, { method: 'PATCH' });
      return;
    }
    // Handle other booking updates (paid, busId, note)
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: id, ...data }),
    });
    return;
  }

  if (collection === 'trips') {
    // Handle trip updates (slot)
    await fetch(`/api/admin/trips`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tripId: id, ...data }),
    });
    return;
  }

  if (collection === 'users') {
    await fetch(`/api/admin/users`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id, ...data }),
    });
    return;
  }

  if (collection === 'routes') {
    await fetch('/api/admin/routes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routeId: id, ...data }),
    });
    return;
  }

  console.warn(`updateDocument: Unhandled collection "${collection}"`);
}

/**
 * Set (create/overwrite) a document.
 */
export async function setDocument(
  path: string,
  data: Record<string, unknown>
): Promise<void> {
  // Re-use updateDocument for now - admin components use setDocument for buses/routes
  await updateDocument(path, data);
}

/**
 * Delete a document.
 */
export async function deleteDocument(path: string): Promise<void> {
  const [collection, id] = path.split('/');

  await fetch(`/api/admin/${collection}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
}