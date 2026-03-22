import { getPool, sql } from './lib/db';
import * as fs from 'fs';
import * as path from 'path';

async function fix() {
  const pool = await getPool();
  const rawData = fs.readFileSync(path.join(__dirname, 'data/holabus-fpt-default-rtdb-export.json'), 'utf8');
  const data = JSON.parse(rawData);
  const routeMaps = data.routeMaps || {};
  
  for (const [routeId, mapData] of Object.entries(routeMaps)) {
    const mapObj = mapData as any;
    if (mapObj.iframeMap) {
      await pool.request()
        .input('route_id', sql.NVarChar, routeId)
        .input('iframe_map', sql.NVarChar, mapObj.iframeMap)
        .query('UPDATE Routes SET iframe_map = @iframe_map WHERE route_id = @route_id');
      console.log(`Updated map for ${routeId}`);
    }
  }
  console.log('Done!');
  process.exit(0);
}
fix().catch(console.error);
