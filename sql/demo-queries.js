const sql = require('mssql');
const config = {
  server: 'moimoi.database.windows.net',
  port: 1433,
  user: 'moitatotato',
  password: '7355608(-)Abc',
  database: 'moiDB',
  options: { encrypt: true, trustServerCertificate: false },
};

async function run() {
  try {
    const pool = await sql.connect(config);
    console.log('--- DEMO QUERIES ---');
    
    // Pick a trip
    const tripId = 'HP1';
    console.log(`\n1. Trước khi đặt vé (EXEC sp_GetTripById @trip_id='${tripId}'):`);
    const t1 = await pool.request().input('trip_id', sql.NVarChar, tripId).execute('sp_GetTripById');
    console.log(t1.recordset[0]);

    // Create a demo booking
    const bookingId = 'DEMO_BOOK_' + Date.now();
    const userId = 'USER_' + Date.now();
    
    // First create a user just in case
    await pool.request()
      .input('user_id', sql.NVarChar, userId)
      .input('name', sql.NVarChar, 'Nguyen Van Demo')
      .input('email', sql.NVarChar, 'demo@example.com')
      .input('phone', sql.NVarChar, '0123456789')
      .input('sex', sql.NVarChar, 'Nam')
      .input('destination', sql.NVarChar, 'Hải Phòng')
      .input('transfer_point', sql.NVarChar, 'Bến xe')
      .execute('sp_CreateUser');

    console.log(`\n2. Thực hiện đặt vé (EXEC sp_CreateBooking):`);
    await pool.request()
        .input('booking_id', sql.NVarChar, bookingId)
        .input('user_id', sql.NVarChar, userId)
        .input('trip_id', sql.NVarChar, tripId)
        .input('is_paid', sql.Bit, 0)
        .input('note', sql.NVarChar, 'Khách VVIP')
        .execute('sp_CreateBooking');
    console.log(`Success! Booking created: ${bookingId}`);

    console.log(`\n3. Sau khi đặt vé (EXEC sp_GetTripById @trip_id='${tripId}'):`);
    const t2 = await pool.request().input('trip_id', sql.NVarChar, tripId).execute('sp_GetTripById');
    console.log(t2.recordset[0]);
    
    console.log(`\n4. Lấy chi tiết vé vừa đặt (EXEC sp_GetBookingById @booking_id='${bookingId}'):`);
    const b1 = await pool.request().input('booking_id', sql.NVarChar, bookingId).execute('sp_GetBookingById');
    console.log(b1.recordset[0]);

    // Clean up demo
    await pool.request().query(`DELETE FROM Bookings WHERE booking_id = '${bookingId}'`);
    await pool.request().query(`DELETE FROM Users WHERE user_id = '${userId}'`);
    await pool.request().query(`UPDATE Trips SET available_slots = available_slots + 1 WHERE trip_id = '${tripId}'`);

    await pool.close();
  } catch(e) { console.error(e); }
}
run();
