const sql = require('mssql');
const config = {
  server: 'moimoi.database.windows.net',
  port: 1433,
  user: 'moitatotato',
  password: '7355608(-)Abc',
  database: 'moiDB',
  options: { encrypt: true, trustServerCertificate: false },
};

async function createSP() {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to SQL Server');

    // --- sp_CreateBooking ---
    await pool.request().query(`
      IF OBJECT_ID('sp_CreateBooking', 'P') IS NOT NULL 
          DROP PROCEDURE sp_CreateBooking;
    `);

    await pool.request().query(`
      CREATE PROCEDURE sp_CreateBooking
          @booking_id NVARCHAR(50),
          @user_id NVARCHAR(50),
          @trip_id NVARCHAR(50),
          @is_paid BIT,
          @note NVARCHAR(MAX)
      AS
      BEGIN
          SET NOCOUNT ON;

          BEGIN TRY
              BEGIN TRANSACTION;
              
              DECLARE @available_slots INT;

              -- Kiểm tra chuyến xe có tồn tại và khóa dòng này để tránh race condition
              SELECT @available_slots = available_slots 
              FROM Trips WITH (UPDLOCK) 
              WHERE trip_id = @trip_id;

              IF @available_slots IS NULL
              BEGIN
                  THROW 50001, 'Trip not found.', 1;
              END

              IF @available_slots <= 0
              BEGIN
                  THROW 50002, 'Trip is fully booked.', 1;
              END

              -- Thêm booking
              INSERT INTO Bookings (booking_id, user_id, trip_id, is_paid, note, created_at)
              VALUES (@booking_id, @user_id, @trip_id, @is_paid, @note, GETDATE());

              -- Giảm số ghế trống
              UPDATE Trips 
              SET available_slots = available_slots - 1 
              WHERE trip_id = @trip_id;

              COMMIT TRANSACTION;
          END TRY
          BEGIN CATCH
              IF @@TRANCOUNT > 0
                  ROLLBACK TRANSACTION;
              
              -- Ném lỗi ra cho ứng dụng xử lý
              THROW;
          END CATCH
      END;
    `);

    // --- sp_GetAdminStats ---
    await pool.request().query(`
      IF OBJECT_ID('sp_GetAdminStats', 'P') IS NOT NULL 
          DROP PROCEDURE sp_GetAdminStats;
    `);

    await pool.request().query(`
      CREATE PROCEDURE sp_GetAdminStats
      AS
      BEGIN
          SET NOCOUNT ON;
          
          DECLARE @totalRoutes INT = (SELECT COUNT(*) FROM Routes);
          DECLARE @totalTrips INT = (SELECT COUNT(*) FROM Trips);
          
          DECLARE @totalBookings INT;
          DECLARE @paid INT;
          DECLARE @unpaid INT;
          DECLARE @today INT;
          
          SELECT 
              @totalBookings = COUNT(*),
              @paid = SUM(CAST(is_paid AS INT)),
              @unpaid = SUM(CASE WHEN is_paid = 0 THEN 1 ELSE 0 END),
              @today = SUM(CASE WHEN CAST(created_at AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END)
          FROM Bookings;
          
          DECLARE @totalRevenue INT;
          SELECT @totalRevenue = ISNULL(SUM(t.price), 0)
          FROM Bookings b
          JOIN Trips t ON b.trip_id = t.trip_id
          WHERE b.is_paid = 1;
          
          SELECT 
              @totalRoutes as totalRoutes,
              @totalTrips as totalTrips,
              ISNULL(@totalBookings, 0) as totalBookings,
              ISNULL(@paid, 0) as completedBookings,
              ISNULL(@unpaid, 0) as pendingBookings,
              ISNULL(@today, 0) as todayBookings,
              ISNULL(@totalRevenue, 0) as totalRevenue;
      END;
    `);
    
    console.log('Stored Procedures created successfully!');
    await pool.close();
  } catch (err) {
    console.error('Error:', err);
  }
}

createSP();
