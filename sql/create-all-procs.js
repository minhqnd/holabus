const sql = require('mssql');
const config = {
  server: 'moimoi.database.windows.net',
  port: 1433,
  user: 'moitatotato',
  password: '7355608(-)Abc',
  database: 'moiDB',
  options: { encrypt: true, trustServerCertificate: false },
};

const sps = [
  // ROUTES
  `CREATE PROCEDURE sp_GetAllRoutes AS BEGIN SET NOCOUNT ON; SELECT * FROM Routes WHERE is_available = 1 END;`,
  `CREATE PROCEDURE sp_GetRouteById @route_id NVARCHAR(50) AS BEGIN SET NOCOUNT ON; SELECT * FROM Routes WHERE route_id = @route_id END;`,
  `CREATE PROCEDURE sp_GetRouteLocations @route_id NVARCHAR(50) AS BEGIN SET NOCOUNT ON; SELECT location_name FROM RouteLocations WHERE route_id = @route_id ORDER BY stop_order END;`,
  `CREATE PROCEDURE sp_GetRouteMap @route_id NVARCHAR(50) AS BEGIN SET NOCOUNT ON; SELECT route_id, iframe_map FROM Routes WHERE route_id = @route_id END;`,

  // TRIPS
  `CREATE PROCEDURE sp_GetTripsByRoute @route_id NVARCHAR(50) AS BEGIN SET NOCOUNT ON; SELECT * FROM Trips WHERE route_id = @route_id END;`,
  `CREATE PROCEDURE sp_GetAllTrips AS BEGIN SET NOCOUNT ON; SELECT t.*, r.name as route_name FROM Trips t LEFT JOIN Routes r ON t.route_id = r.route_id END;`,
  `CREATE PROCEDURE sp_GetTripById @trip_id NVARCHAR(50) AS BEGIN SET NOCOUNT ON; SELECT t.*, r.name as route_name FROM Trips t LEFT JOIN Routes r ON t.route_id = r.route_id WHERE trip_id = @trip_id END;`,

  // USERS
  `CREATE PROCEDURE sp_GetUserById @user_id NVARCHAR(50) AS BEGIN SET NOCOUNT ON; SELECT * FROM Users WHERE user_id = @user_id END;`,
  `CREATE PROCEDURE sp_GetAllUsers AS BEGIN SET NOCOUNT ON; SELECT * FROM Users END;`,
  `CREATE PROCEDURE sp_CreateUser 
      @user_id NVARCHAR(50), 
      @name NVARCHAR(100), 
      @email NVARCHAR(100), 
      @phone NVARCHAR(20), 
      @sex NVARCHAR(5), 
      @destination NVARCHAR(255), 
      @transfer_point NVARCHAR(50) 
   AS BEGIN 
      SET NOCOUNT ON; 
      INSERT INTO Users (user_id, name, email, phone, sex, destination, transfer_point) 
      VALUES (@user_id, @name, @email, @phone, @sex, @destination, @transfer_point) 
   END;`,

  // BOOKINGS & ADMIN BOOKINGS
  `CREATE PROCEDURE sp_GetBookingById @booking_id NVARCHAR(50) AS BEGIN SET NOCOUNT ON; SELECT * FROM Bookings WHERE booking_id = @booking_id END;`,
  `CREATE PROCEDURE sp_CheckBookingExists @booking_id NVARCHAR(50) AS BEGIN SET NOCOUNT ON; SELECT 1 as exists_val FROM Bookings WHERE booking_id = @booking_id END;`,
  `CREATE PROCEDURE sp_CheckInBooking 
      @booking_id NVARCHAR(50),
      @checkin_time DATETIME
   AS BEGIN 
      SET NOCOUNT ON; 
      UPDATE Bookings SET is_checked_in = 1, checkin_time = @checkin_time WHERE booking_id = @booking_id 
   END;`,
  `CREATE PROCEDURE sp_GetAllBookingsDetails AS BEGIN 
      SET NOCOUNT ON; 
      SELECT 
          b.booking_id, b.user_id, b.trip_id, b.bus_id,
          b.created_at, b.is_paid, b.is_checked_in, b.checkin_time, b.note,
          u.name as user_name, u.phone as user_phone, u.email as user_email,
          u.destination, u.transfer_point,
          t.name as trip_name, t.trip_date, t.departure_time, t.price as trip_price, t.route_id,
          r.name as route_name
      FROM Bookings b
      LEFT JOIN Users u ON b.user_id = u.user_id
      LEFT JOIN Trips t ON b.trip_id = t.trip_id
      LEFT JOIN Routes r ON t.route_id = r.route_id
      ORDER BY b.created_at DESC
   END;`,
  `CREATE PROCEDURE sp_UpdateBookingAdmin
      @booking_id NVARCHAR(50),
      @is_paid BIT = NULL,
      @bus_id NVARCHAR(50) = NULL,
      @note NVARCHAR(MAX) = NULL
   AS BEGIN
      SET NOCOUNT ON;
      UPDATE Bookings 
      SET 
          is_paid = COALESCE(@is_paid, is_paid),
          bus_id = COALESCE(@bus_id, bus_id),
          note = COALESCE(@note, note)
      WHERE booking_id = @booking_id
   END;`,
   `CREATE PROCEDURE sp_UpdateTripAdmin
      @trip_id NVARCHAR(50),
      @route_id NVARCHAR(50) = NULL,
      @trip_date NVARCHAR(20) = NULL,
      @time NVARCHAR(10) = NULL,
      @price INT = NULL,
      @slot INT = NULL,
      @name NVARCHAR(100) = NULL
   AS BEGIN
      SET NOCOUNT ON;
      UPDATE Trips
      SET
          route_id = COALESCE(@route_id, route_id),
          trip_date = COALESCE(@trip_date, trip_date),
          departure_time = COALESCE(@time, departure_time),
          price = COALESCE(@price, price),
          available_slots = COALESCE(@slot, available_slots),
          name = COALESCE(@name, name)
      WHERE trip_id = @trip_id
   END;`,
   `CREATE PROCEDURE sp_UpdateUserAdmin
      @user_id NVARCHAR(50),
      @name NVARCHAR(100) = NULL,
      @email NVARCHAR(100) = NULL,
      @phone NVARCHAR(20) = NULL
   AS BEGIN
      SET NOCOUNT ON;
      UPDATE Users
      SET
          name = COALESCE(@name, name),
          email = COALESCE(@email, email),
          phone = COALESCE(@phone, phone)
      WHERE user_id = @user_id
   END;`,

  // BUSES
  `CREATE PROCEDURE sp_GetAllBuses AS BEGIN SET NOCOUNT ON; SELECT * FROM Buses END;`,

  // AUTH
  `CREATE PROCEDURE sp_AdminLogin @email NVARCHAR(100), @password NVARCHAR(255) AS BEGIN 
      SET NOCOUNT ON; 
      SELECT email FROM Admins WHERE email = @email AND password_hash = @password 
   END;`,
   
   // Admin Checkin API Data (GetAllBookings, etc.)
   `CREATE PROCEDURE sp_GetAllBookings AS BEGIN SET NOCOUNT ON; SELECT * FROM Bookings END;`,
];

async function run() {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to DB');

    for (const sp of sps) {
      // Extract name
      const match = sp.match(/CREATE PROCEDURE (\w+)/i);
      if (match) {
        const name = match[1];
        await pool.request().query(`IF OBJECT_ID('${name}', 'P') IS NOT NULL DROP PROCEDURE ${name}`);
        await pool.request().query(sp);
        console.log('Created:', name);
      }
    }
    
    console.log('All 100% SPs applied!');
    await pool.close();
  } catch (e) {
    console.error(e);
  }
}

run();
