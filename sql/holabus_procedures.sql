-- =======================================================
-- HOLABUS - BỘ LỆNH TẠO STORED PROCEDURES TOÀN DIỆN
-- (Hỗ trợ chạy an toàn nhiều lần nhờ CREATE OR ALTER)
-- =======================================================

-- --------------------------------------------------------------------------------------
-- 1. NGHIỆP VỤ CỐT LÕI (CORE BUSINESS LOGIC)
-- --------------------------------------------------------------------------------------
GO

-- 1.1 Khóa Chống Trùng Đặt Lặp Chỗ Ngồi (Giao Dịch Đảo Đảm)
CREATE OR ALTER PROCEDURE sp_CreateBooking
    @booking_id NVARCHAR(50),
    @user_id NVARCHAR(50), 
    @trip_id NVARCHAR(50),
    @is_paid BIT, 
    @note NVARCHAR(MAX) = ''
AS BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        DECLARE @available_slots INT;

        SELECT @available_slots = available_slots FROM Trips WITH (UPDLOCK) WHERE trip_id = @trip_id;

        IF @available_slots IS NULL THROW 50001, 'Trip not found.', 1;
        IF @available_slots <= 0 THROW 50002, 'Trip is fully booked.', 1;

        INSERT INTO Bookings (booking_id, user_id, trip_id, is_paid, note, created_at)
        VALUES (@booking_id, @user_id, @trip_id, @is_paid, @note, GETDATE());

        UPDATE Trips SET available_slots = available_slots - 1 WHERE trip_id = @trip_id;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- 1.2 Báo Cáo Thống Kê Tổng Hợp Cho Admin (Dashboard)
CREATE OR ALTER PROCEDURE sp_GetAdminStats
AS BEGIN
    SET NOCOUNT ON;
    DECLARE @totalRoutes INT = (SELECT COUNT(*) FROM Routes);
    DECLARE @totalTrips INT = (SELECT COUNT(*) FROM Trips);
    DECLARE @totalBookings INT; DECLARE @paid INT; DECLARE @unpaid INT; DECLARE @today INT;
    
    SELECT 
        @totalBookings = COUNT(*),
        @paid = SUM(CAST(is_paid AS INT)),
        @unpaid = SUM(CASE WHEN is_paid = 0 THEN 1 ELSE 0 END),
        @today = SUM(CASE WHEN CAST(created_at AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END)
    FROM Bookings;
    
    DECLARE @totalRevenue INT;
    SELECT @totalRevenue = ISNULL(SUM(t.price), 0)
    FROM Bookings b JOIN Trips t ON b.trip_id = t.trip_id WHERE b.is_paid = 1;
    
    SELECT 
        @totalRoutes as totalRoutes, @totalTrips as totalTrips,
        ISNULL(@totalBookings, 0) as totalBookings, ISNULL(@paid, 0) as completedBookings,
        ISNULL(@unpaid, 0) as pendingBookings, ISNULL(@today, 0) as todayBookings,
        ISNULL(@totalRevenue, 0) as totalRevenue;
END;
GO

-- --------------------------------------------------------------------------------------
-- 2. NHÓM QUẢN TRỊ TUYẾN ĐƯỜNG (ROUTES)
-- --------------------------------------------------------------------------------------
GO

CREATE OR ALTER PROCEDURE sp_GetAllRoutes 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT * FROM Routes;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetRouteById @route_id NVARCHAR(50) 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT * FROM Routes WHERE route_id = @route_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetAllRouteLocations 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT route_id, location_name FROM RouteLocations ORDER BY route_id, stop_order;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetRouteLocations @route_id NVARCHAR(50) 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT location_name FROM RouteLocations WHERE route_id = @route_id ORDER BY stop_order;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetRouteMap @route_id NVARCHAR(50) 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT route_id, iframe_map FROM Routes WHERE route_id = @route_id;
END;
GO


-- --------------------------------------------------------------------------------------
-- 3. NHÓM QUẢN TRỊ CHUYẾN XE (TRIPS & BUSES)
-- --------------------------------------------------------------------------------------
GO

CREATE OR ALTER PROCEDURE sp_GetTripsByRoute @route_id NVARCHAR(50) 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT * FROM Trips WHERE route_id = @route_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetAllTrips 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT t.*, r.name as route_name 
    FROM Trips t LEFT JOIN Routes r ON t.route_id = r.route_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetTripById @trip_id NVARCHAR(50) 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT t.*, r.name as route_name 
    FROM Trips t LEFT JOIN Routes r ON t.route_id = r.route_id WHERE trip_id = @trip_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateTripAdmin
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
    SET route_id = COALESCE(@route_id, route_id), 
        trip_date = COALESCE(@trip_date, trip_date),
        departure_time = COALESCE(@time, departure_time), 
        price = COALESCE(@price, price),
        available_slots = COALESCE(@slot, available_slots), 
        name = COALESCE(@name, name)
    WHERE trip_id = @trip_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetAllBuses 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT * FROM Buses;
END;
GO

-- --------------------------------------------------------------------------------------
-- 4. NHÓM QUẢN TRỊ HÀNH KHÁCH (USERS)
-- --------------------------------------------------------------------------------------
GO

CREATE OR ALTER PROCEDURE sp_CreateUser 
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
    VALUES (@user_id, @name, @email, @phone, @sex, @destination, @transfer_point);
END;
GO

CREATE OR ALTER PROCEDURE sp_GetUserById @user_id NVARCHAR(50) 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT * FROM Users WHERE user_id = @user_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetAllUsers 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT * FROM Users;
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateUserAdmin
    @user_id NVARCHAR(50), 
    @name NVARCHAR(100) = NULL, 
    @email NVARCHAR(100) = NULL, 
    @phone NVARCHAR(20) = NULL
AS BEGIN
    SET NOCOUNT ON;
    UPDATE Users
    SET name = COALESCE(@name, name), 
        email = COALESCE(@email, email), 
        phone = COALESCE(@phone, phone)
    WHERE user_id = @user_id;
END;
GO


-- --------------------------------------------------------------------------------------
-- 5. NHÓM QUẢN TRỊ ĐƠN VÉ (BOOKINGS & AUTH)
-- --------------------------------------------------------------------------------------
GO

CREATE OR ALTER PROCEDURE sp_CheckBookingExists @booking_id NVARCHAR(50) 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT 1 as exists_val FROM Bookings WHERE booking_id = @booking_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetAllBookings 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT * FROM Bookings;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetBookingById @booking_id NVARCHAR(50) 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT * FROM Bookings WHERE booking_id = @booking_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_GetAllBookingsDetails 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT 
        b.booking_id, b.user_id, b.trip_id, b.bus_id, b.created_at, b.is_paid, 
        b.is_checked_in, b.checkin_time, b.note, 
        u.name as user_name, u.phone as user_phone, u.email as user_email, u.destination, u.transfer_point, 
        t.name as trip_name, t.trip_date, t.departure_time, t.price as trip_price, t.route_id, 
        r.name as route_name
    FROM Bookings b
    LEFT JOIN Users u ON b.user_id = u.user_id
    LEFT JOIN Trips t ON b.trip_id = t.trip_id
    LEFT JOIN Routes r ON t.route_id = r.route_id
    ORDER BY b.created_at DESC;
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateBookingAdmin
    @booking_id NVARCHAR(50), 
    @is_paid BIT = NULL, 
    @bus_id NVARCHAR(50) = NULL, 
    @note NVARCHAR(MAX) = NULL
AS BEGIN
    SET NOCOUNT ON;
    UPDATE Bookings 
    SET is_paid = COALESCE(@is_paid, is_paid), 
        bus_id = COALESCE(@bus_id, bus_id), 
        note = COALESCE(@note, note)
    WHERE booking_id = @booking_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_CheckInBooking 
    @booking_id NVARCHAR(50), 
    @checkin_time DATETIME
AS BEGIN 
    SET NOCOUNT ON; 
    UPDATE Bookings 
    SET is_checked_in = 1, checkin_time = @checkin_time 
    WHERE booking_id = @booking_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_AdminLogin 
    @email NVARCHAR(100), 
    @password NVARCHAR(255) 
AS BEGIN 
    SET NOCOUNT ON; 
    SELECT email FROM Admins WHERE email = @email AND password_hash = @password; 
END;
GO

-- --------------------------------------------------------------------------------------
-- 6. NHÓM QUẢN TRỊ BỔ SUNG (THEO YÊU CẦU NGHIỆP VỤ CRUD BỔ SUNG)
-- --------------------------------------------------------------------------------------
GO

-- 6.1 Thêm, Sửa, Xóa Tuyến Đường (Routes)
CREATE OR ALTER PROCEDURE sp_CreateRoute
    @route_id NVARCHAR(50), 
    @name NVARCHAR(100), 
    @price INT, 
    @is_available BIT = 1,
    @iframe_map NVARCHAR(MAX) = ''
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO Routes (route_id, name, price, is_available, iframe_map)
    VALUES (@route_id, @name, @price, @is_available, @iframe_map);
END;
GO

CREATE OR ALTER PROCEDURE sp_UpdateRoute
    @route_id NVARCHAR(50), 
    @name NVARCHAR(100) = NULL, 
    @price INT = NULL, 
    @is_available BIT = NULL,
    @iframe_map NVARCHAR(MAX) = NULL
AS BEGIN
    SET NOCOUNT ON;
    UPDATE Routes
    SET name = COALESCE(@name, name),
        price = COALESCE(@price, price),
        is_available = COALESCE(@is_available, is_available),
        iframe_map = COALESCE(@iframe_map, iframe_map)
    WHERE route_id = @route_id;
END;
GO

CREATE OR ALTER PROCEDURE sp_DeleteRoute
    @route_id NVARCHAR(50)
AS BEGIN
    SET NOCOUNT ON;
    -- Xóa các điểm dừng phụ trợ trước (Foreign Key constraint)
    DELETE FROM RouteLocations WHERE route_id = @route_id;
    DELETE FROM Routes WHERE route_id = @route_id;
END;
GO

-- 6.2 Thêm, Xóa Chuyến Xe (Trips)
CREATE OR ALTER PROCEDURE sp_CreateTrip
    @trip_id NVARCHAR(50), 
    @route_id NVARCHAR(50), 
    @name NVARCHAR(100), 
    @available_slots INT, 
    @trip_date NVARCHAR(20), 
    @departure_time NVARCHAR(10), 
    @price INT
AS BEGIN
    SET NOCOUNT ON;
    INSERT INTO Trips (trip_id, route_id, name, available_slots, trip_date, departure_time, price)
    VALUES (@trip_id, @route_id, @name, @available_slots, @trip_date, @departure_time, @price);
END;
GO

CREATE OR ALTER PROCEDURE sp_DeleteTrip
    @trip_id NVARCHAR(50)
AS BEGIN
    SET NOCOUNT ON;
    DELETE FROM Trips WHERE trip_id = @trip_id;
END;
GO
