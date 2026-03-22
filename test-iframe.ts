const { getPool } = require('./lib/db');

async function test() {
  const pool = await getPool();
  const res = await pool.request().query('SELECT route_id, iframe_map FROM Routes WHERE route_id = \\'QUANGNINH\\'');
  console.log(res.recordset);
  process.exit(0);
}
test();
