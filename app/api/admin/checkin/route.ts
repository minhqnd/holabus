import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// Get all data needed for checkin page
export async function GET() {
  try {
    const pool = await getPool();

    const [bookingsR, usersR, tripsR, routesR, busesR] = await Promise.all([
      pool.request().query('SELECT * FROM Bookings'),
      pool.request().query('SELECT * FROM Users'),
      pool.request().query('SELECT * FROM Trips'),
      pool.request().query('SELECT * FROM Routes'),
      pool.request().query('SELECT * FROM Buses'),
    ]);

    // Convert to key-value objects (matching Firebase format)
    const toMap = (records: Record<string, unknown>[], key: string) => {
      const map: Record<string, unknown> = {};
      for (const r of records) {
        map[r[key] as string] = r;
      }
      return map;
    };

    const bookings: Record<string, unknown> = {};
    for (const b of bookingsR.recordset) {
      bookings[b.booking_id] = {
        userId: b.user_id,
        tripId: b.trip_id,
        busId: b.bus_id,
        paid: b.is_paid,
        checkin: b.is_checked_in ? (b.checkin_time?.toISOString() || true) : false,
        createdAt: b.created_at,
        note: b.note,
      };
    }

    const users: Record<string, unknown> = {};
    for (const u of usersR.recordset) {
      users[u.user_id] = {
        name: u.name,
        mail: u.email,
        phone: u.phone,
        destination: u.destination,
        transferPoint: u.transfer_point,
      };
    }

    const trips: Record<string, unknown> = {};
    for (const t of tripsR.recordset) {
      trips[t.trip_id] = {
        name: t.name,
        routeId: t.route_id,
        date: t.trip_date,
        time: t.departure_time,
        price: typeof t.price === 'number' ? t.price.toLocaleString('vi-VN').replace(/,/g, '.') : t.price,
        slot: t.available_slots,
      };
    }

    const routes: Record<string, unknown> = {};
    for (const r of routesR.recordset) {
      routes[r.route_id] = {
        name: r.name,
      };
    }

    const buses: Record<string, unknown> = {};
    for (const b of busesR.recordset) {
      buses[b.bus_id] = {
        id: b.bus_id,
        name: b.name,
        plateNumber: b.plate_number || '',
        active: b.is_active,
      };
    }

    return NextResponse.json({ bookings, users, trips, routes, buses });
  } catch (error) {
    console.error('Error fetching checkin data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
