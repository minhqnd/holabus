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
      ALTER PROCEDURE sp_GetAllRoutes 
      AS BEGIN 
          SET NOCOUNT ON; 
          SELECT * FROM Routes;
      END;
    `);
    console.log("Success Alter PROCs");
    await pool.close();
  } catch(e) { console.error(e); }
}
fix();
