const sql = require('mssql');
const fs = require('fs');

const config = {
  server: 'moimoi.database.windows.net',
  port: 1433,
  user: 'moitatotato',
  password: '7355608(-)Abc',
  database: 'moiDB',
  options: { encrypt: true, trustServerCertificate: false }
};

async function deploy() {
  try {
    const pool = await sql.connect(config);
    
    // Deploying the new CRUD SPs
    await pool.request().query(`
      CREATE OR ALTER PROCEDURE sp_CreateRoute
          @route_id NVARCHAR(50), @name NVARCHAR(100), @price INT, 
          @is_available BIT = 1, @iframe_map NVARCHAR(MAX) = ''
      AS BEGIN
          SET NOCOUNT ON;
          INSERT INTO Routes (route_id, name, price, is_available, iframe_map)
          VALUES (@route_id, @name, @price, @is_available, @iframe_map);
      END;
    `);

    await pool.request().query(`
      CREATE OR ALTER PROCEDURE sp_UpdateRoute
          @route_id NVARCHAR(50), @name NVARCHAR(100) = NULL, @price INT = NULL, 
          @is_available BIT = NULL, @iframe_map NVARCHAR(MAX) = NULL
      AS BEGIN
          SET NOCOUNT ON;
          UPDATE Routes
          SET name = COALESCE(@name, name), price = COALESCE(@price, price),
              is_available = COALESCE(@is_available, is_available), iframe_map = COALESCE(@iframe_map, iframe_map)
          WHERE route_id = @route_id;
      END;
    `);

    await pool.request().query(`
      CREATE OR ALTER PROCEDURE sp_DeleteRoute
          @route_id NVARCHAR(50)
      AS BEGIN
          SET NOCOUNT ON;
          DELETE FROM RouteLocations WHERE route_id = @route_id;
          DELETE FROM Routes WHERE route_id = @route_id;
      END;
    `);

    await pool.request().query(`
      CREATE OR ALTER PROCEDURE sp_CreateTrip
          @trip_id NVARCHAR(50), @route_id NVARCHAR(50), @name NVARCHAR(100), 
          @available_slots INT, @trip_date NVARCHAR(20), @departure_time NVARCHAR(10), @price INT
      AS BEGIN
          SET NOCOUNT ON;
          INSERT INTO Trips (trip_id, route_id, name, available_slots, trip_date, departure_time, price)
          VALUES (@trip_id, @route_id, @name, @available_slots, @trip_date, @departure_time, @price);
      END;
    `);

    await pool.request().query(`
      CREATE OR ALTER PROCEDURE sp_DeleteTrip
          @trip_id NVARCHAR(50)
      AS BEGIN
          SET NOCOUNT ON;
          DELETE FROM Trips WHERE trip_id = @trip_id;
      END;
    `);

    console.log("Success Deploying Missing CRUD");
    await pool.close();
  } catch(e) { console.error(e); }
}
deploy();
