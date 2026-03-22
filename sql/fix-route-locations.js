const sql = require('mssql');
const config = {
  server: 'moimoi.database.windows.net',
  port: 1433,
  user: 'moitatotato',
  password: '7355608(-)Abc',
  database: 'moiDB',
  options: { encrypt: true, trustServerCertificate: false }
};

async function fix() {
  try {
    const pool = await sql.connect(config);
    await pool.request().query(`
      CREATE OR ALTER PROCEDURE sp_GetAllRouteLocations
      AS BEGIN
          SET NOCOUNT ON;
          SELECT route_id, location_name FROM RouteLocations ORDER BY route_id, stop_order;
      END;
    `);
    console.log("Success Creating sp_GetAllRouteLocations");
    await pool.close();
  } catch(e) { console.error(e); }
}
fix();
