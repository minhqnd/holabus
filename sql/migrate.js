/**
 * Script: Migrate Firebase JSON data into SQL Server
 * Reads holabus-fpt-default-rtdb-export.json and:
 * 1. Creates tables (DDL)
 * 2. Inserts all data (Seed)
 */
const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const config = {
  server: 'moimoi.database.windows.net',
  port: 1433,
  user: 'moitatotato',
  password: '7355608(-)Abc',
  database: 'moiDB',
  options: { encrypt: true, trustServerCertificate: false },
  connectionTimeout: 30000,
  requestTimeout: 30000,
};

async function main() {
  const pool = await sql.connect(config);
  console.log('✅ Connected to SQL Server');

  // Read Firebase JSON
  const dataPath = path.join(__dirname, '..', 'data', 'holabus-fpt-default-rtdb-export.json');
  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // ========== 1. DROP existing tables ==========
  console.log('\n🗑️  Dropping existing tables...');
  const dropSQL = `
    IF OBJECT_ID('Bookings', 'U') IS NOT NULL DROP TABLE Bookings;
    IF OBJECT_ID('RouteLocations', 'U') IS NOT NULL DROP TABLE RouteLocations;
    IF OBJECT_ID('Trips', 'U') IS NOT NULL DROP TABLE Trips;
    IF OBJECT_ID('Routes', 'U') IS NOT NULL DROP TABLE Routes;
    IF OBJECT_ID('Buses', 'U') IS NOT NULL DROP TABLE Buses;
    IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
    IF OBJECT_ID('Admins', 'U') IS NOT NULL DROP TABLE Admins;
  `;
  await pool.request().query(dropSQL);
  console.log('   Done.');

  // ========== 2. CREATE tables ==========
  console.log('\n📐 Creating tables...');

  await pool.request().query(`
    CREATE TABLE Routes (
      route_id NVARCHAR(50) PRIMARY KEY,
      name NVARCHAR(100) NOT NULL,
      price INT NOT NULL,
      is_available BIT DEFAULT 0,
      iframe_map NVARCHAR(MAX) NULL
    );
  `);

  await pool.request().query(`
    CREATE TABLE RouteLocations (
      id INT IDENTITY(1,1) PRIMARY KEY,
      route_id NVARCHAR(50) NOT NULL,
      location_name NVARCHAR(255) NOT NULL,
      stop_order INT NOT NULL,
      FOREIGN KEY (route_id) REFERENCES Routes(route_id)
    );
  `);

  await pool.request().query(`
    CREATE TABLE Buses (
      bus_id NVARCHAR(50) PRIMARY KEY,
      name NVARCHAR(100) NOT NULL,
      plate_number NVARCHAR(20) NULL,
      is_active BIT DEFAULT 1
    );
  `);

  await pool.request().query(`
    CREATE TABLE Trips (
      trip_id NVARCHAR(50) PRIMARY KEY,
      route_id NVARCHAR(50) NOT NULL,
      name NVARCHAR(100) NOT NULL,
      trip_date NVARCHAR(20) NOT NULL,
      departure_time NVARCHAR(10) NOT NULL,
      price INT NOT NULL,
      available_slots INT DEFAULT 29,
      FOREIGN KEY (route_id) REFERENCES Routes(route_id)
    );
  `);

  await pool.request().query(`
    CREATE TABLE Users (
      user_id NVARCHAR(50) PRIMARY KEY,
      name NVARCHAR(100) NOT NULL,
      email NVARCHAR(100) NOT NULL,
      confirm_email NVARCHAR(100) NULL,
      phone NVARCHAR(20) NOT NULL,
      sex NVARCHAR(5) NULL,
      destination NVARCHAR(255) NULL,
      transfer_point NVARCHAR(50) NULL,
      is_admin BIT DEFAULT 0
    );
  `);

  await pool.request().query(`
    CREATE TABLE Bookings (
      booking_id NVARCHAR(50) PRIMARY KEY,
      user_id NVARCHAR(50) NOT NULL,
      trip_id NVARCHAR(50) NOT NULL,
      bus_id NVARCHAR(50) NULL,
      created_at DATETIME DEFAULT GETDATE(),
      is_paid BIT DEFAULT 0,
      is_checked_in BIT DEFAULT 0,
      checkin_time DATETIME NULL,
      note NVARCHAR(MAX) NULL,
      FOREIGN KEY (user_id) REFERENCES Users(user_id),
      FOREIGN KEY (trip_id) REFERENCES Trips(trip_id),
      FOREIGN KEY (bus_id) REFERENCES Buses(bus_id)
    );
  `);

  await pool.request().query(`
    CREATE TABLE Admins (
      id INT IDENTITY(1,1) PRIMARY KEY,
      email NVARCHAR(100) NOT NULL UNIQUE,
      password_hash NVARCHAR(255) NOT NULL
    );
  `);

  console.log('   Done.');

  // ========== 3. INSERT Routes ==========
  console.log('\n📥 Inserting Routes...');
  const routes = raw.routes || {};
  const routeMaps = raw.routeMaps || {};
  let routeCount = 0;
  for (const [routeId, route] of Object.entries(routes)) {
    const r = route;
    const priceNum = parseInt(String(r.price || '0').replace(/\./g, '').replace(/,/g, ''));
    const iframeMap = routeMaps[routeId]?.iframeMap || null;
    await pool.request()
      .input('route_id', sql.NVarChar, routeId)
      .input('name', sql.NVarChar, r.name || '')
      .input('price', sql.Int, priceNum)
      .input('is_available', sql.Bit, r.available ? 1 : 0)
      .input('iframe_map', sql.NVarChar, iframeMap)
      .query('INSERT INTO Routes (route_id, name, price, is_available, iframe_map) VALUES (@route_id, @name, @price, @is_available, @iframe_map)');

    // Insert locations
    const locations = r.locations || [];
    for (let i = 0; i < locations.length; i++) {
      await pool.request()
        .input('route_id', sql.NVarChar, routeId)
        .input('location_name', sql.NVarChar, locations[i].trim())
        .input('stop_order', sql.Int, i)
        .query('INSERT INTO RouteLocations (route_id, location_name, stop_order) VALUES (@route_id, @location_name, @stop_order)');
    }
    routeCount++;
  }
  console.log(`   ${routeCount} routes inserted.`);

  // ========== 4. INSERT Buses ==========
  console.log('\n📥 Inserting Buses...');
  const buses = raw.buses || {};
  let busCount = 0;
  for (const [busId, bus] of Object.entries(buses)) {
    const b = bus;
    await pool.request()
      .input('bus_id', sql.NVarChar, busId)
      .input('name', sql.NVarChar, b.name || '')
      .input('plate_number', sql.NVarChar, (b.plateNumber || '').trim() || null)
      .input('is_active', sql.Bit, b.active ? 1 : 0)
      .query('INSERT INTO Buses (bus_id, name, plate_number, is_active) VALUES (@bus_id, @name, @plate_number, @is_active)');
    busCount++;
  }
  console.log(`   ${busCount} buses inserted.`);

  // ========== 5. INSERT Trips ==========
  console.log('\n📥 Inserting Trips...');
  const trips = raw.trips || {};
  let tripCount = 0;
  for (const [tripId, trip] of Object.entries(trips)) {
    const t = trip;
    const priceNum = parseInt(String(t.price || '0').replace(/\./g, '').replace(/,/g, ''));
    await pool.request()
      .input('trip_id', sql.NVarChar, tripId)
      .input('route_id', sql.NVarChar, t.routeId || '')
      .input('name', sql.NVarChar, t.name || '')
      .input('trip_date', sql.NVarChar, t.date || '')
      .input('departure_time', sql.NVarChar, t.time || '')
      .input('price', sql.Int, priceNum)
      .input('available_slots', sql.Int, t.slot != null ? t.slot : 29)
      .query('INSERT INTO Trips (trip_id, route_id, name, trip_date, departure_time, price, available_slots) VALUES (@trip_id, @route_id, @name, @trip_date, @departure_time, @price, @available_slots)');
    tripCount++;
  }
  console.log(`   ${tripCount} trips inserted.`);

  // ========== 6. INSERT Users ==========
  console.log('\n📥 Inserting Users...');
  const users = raw.users || {};
  const adminsMap = raw.admin || {};
  let userCount = 0;

  // Build admin email set
  const adminEmails = new Set(
    Object.keys(adminsMap).map(k => k.replace(/_/g, '.'))
  );

  for (const [userId, user] of Object.entries(users)) {
    const u = user;
    const email = u.mail || '';
    const isAdmin = adminEmails.has(email) ? 1 : 0;
    await pool.request()
      .input('user_id', sql.NVarChar, userId)
      .input('name', sql.NVarChar, u.name || '')
      .input('email', sql.NVarChar, email)
      .input('confirm_email', sql.NVarChar, u.confirmEmail || null)
      .input('phone', sql.NVarChar, u.phone || '')
      .input('sex', sql.NVarChar, u.sex || null)
      .input('destination', sql.NVarChar, u.destination || null)
      .input('transfer_point', sql.NVarChar, u.transferPoint || null)
      .input('is_admin', sql.Bit, isAdmin)
      .query('INSERT INTO Users (user_id, name, email, confirm_email, phone, sex, destination, transfer_point, is_admin) VALUES (@user_id, @name, @email, @confirm_email, @phone, @sex, @destination, @transfer_point, @is_admin)');
    userCount++;
  }
  console.log(`   ${userCount} users inserted.`);

  // ========== 7. INSERT Bookings ==========
  console.log('\n📥 Inserting Bookings...');
  const bookings = raw.bookings || {};
  let bookingCount = 0;
  let skipped = 0;
  for (const [bookingId, booking] of Object.entries(bookings)) {
    const b = booking;
    // Determine checkin state
    let isCheckedIn = 0;
    let checkinTime = null;
    if (b.checkin === true) {
      isCheckedIn = 1;
    } else if (typeof b.checkin === 'string' && b.checkin.length > 0) {
      isCheckedIn = 1;
      checkinTime = new Date(b.checkin);
    }

    // Check if userId and tripId exist (skip orphans)
    if (!users[b.userId]) {
      skipped++;
      continue;
    }

    await pool.request()
      .input('booking_id', sql.NVarChar, bookingId)
      .input('user_id', sql.NVarChar, b.userId || '')
      .input('trip_id', sql.NVarChar, b.tripId || '')
      .input('bus_id', sql.NVarChar, b.busId || null)
      .input('created_at', sql.DateTime, b.createdAt ? new Date(b.createdAt) : new Date())
      .input('is_paid', sql.Bit, b.paid ? 1 : 0)
      .input('is_checked_in', sql.Bit, isCheckedIn)
      .input('checkin_time', sql.DateTime, checkinTime)
      .input('note', sql.NVarChar, b.note || null)
      .query('INSERT INTO Bookings (booking_id, user_id, trip_id, bus_id, created_at, is_paid, is_checked_in, checkin_time, note) VALUES (@booking_id, @user_id, @trip_id, @bus_id, @created_at, @is_paid, @is_checked_in, @checkin_time, @note)');
    bookingCount++;
  }
  console.log(`   ${bookingCount} bookings inserted. (${skipped} skipped - orphan users)`);

  // ========== 8. INSERT Admin account ==========
  console.log('\n📥 Creating admin account...');
  await pool.request()
    .input('email', sql.NVarChar, 'admin@holabus.com')
    .input('password_hash', sql.NVarChar, 'holabus2025')
    .query('INSERT INTO Admins (email, password_hash) VALUES (@email, @password_hash)');
  console.log('   Admin account created: admin@holabus.com / holabus2025');

  // ========== Done ==========
  console.log('\n🎉 Migration complete!');
  console.log(`   Routes: ${routeCount}`);
  console.log(`   Buses: ${busCount}`);
  console.log(`   Trips: ${tripCount}`);
  console.log(`   Users: ${userCount}`);
  console.log(`   Bookings: ${bookingCount}`);

  await pool.close();
}

main().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
