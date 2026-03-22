# Báo Cáo Thiết Kế Cơ Sở Dữ Liệu HolaBus (SQL Server)

Tài liệu này tổng hợp cấu trúc cơ sở dữ liệu, các thủ tục lưu trữ (Stored Procedures), và cách giải quyết các bài toán nghiệp vụ (business logic) của hệ thống HolaBus sau khi làm mới trên hệ quản trị SQL Server. Mọi tác vụ truy vấn đọc/ghi đều đã được bảo vệ hoàn toàn bởi **Stored Procedures**.

---

## 1. Sơ Đồ Thực Thể Kết Nạp (ERD)

Sơ đồ thể hiện luồng liên kết dữ liệu giữa 7 bảng chính:

```mermaid
erDiagram
    Routes ||--o{ Trips : "Có nhiều chuyến đi"
    Routes ||--o{ RouteLocations : "Có nhiều điểm trung chuyển"
    Trips ||--o{ Bookings : "Nhận nhiều lượt đặt"
    Users ||--o{ Bookings : "Thực hiện nhiều lượt đặt"
    Buses ||--o{ Bookings : "Được phân công"

    Routes {
        string route_id PK
        string name
        int price
        boolean is_available
        string iframe_map
    }

    RouteLocations {
        int id PK
        string route_id FK
        int stop_order
        string location_name
    }

    Trips {
        string trip_id PK
        string route_id FK
        string name
        int available_slots
        date trip_date
        time departure_time
        int price
    }

    Users {
        string user_id PK
        string name
        string email
        string confirm_email
        string phone
        string sex
        string destination
        string transfer_point
        boolean is_admin
    }

    Buses {
        string bus_id PK
        string name
        string plate_number
        boolean is_active
    }

    Bookings {
        string booking_id PK
        string user_id FK
        string trip_id FK
        string bus_id FK "Nullable"
        boolean is_paid
        boolean is_checked_in
        datetime checkin_time "Nullable"
        string note "Nullable"
        datetime created_at
    }

    Admins {
        int id PK
        string email UNIQUE
        string password_hash
    }
```

---

## 2. Các Bài Toán Nghiệp Vụ Cốt Lõi (Core Logic)

### 2.1. Bài toán: Khóa Chống Đặt Trùng Lặp Chỗ Ngồi (Overbooking)
* **Tình huống sử dụng:** Khi có 2 khách hàng cùng đặt 1 chỗ ngồi cuối cùng, giao dịch (Transaction) phải hủy lệnh thứ 2 để chống hệ thống ảo chỗ.
* **Cách gọi từ Database (T-SQL Exec):**
  ```sql
  EXEC sp_CreateBooking 
      @booking_id = 'B123', @user_id = 'U001', 
      @trip_id = 'HP1', @is_paid = 0, @note = 'Sinh viên';
  ```
* **Mã Nguồn CSDL:**
  ```sql
  CREATE PROCEDURE sp_CreateBooking
      @booking_id NVARCHAR(50),  @user_id NVARCHAR(50), 
      @trip_id NVARCHAR(50),     @is_paid BIT, 
      @note NVARCHAR(MAX)
  AS BEGIN
      SET NOCOUNT ON;
      BEGIN TRY
          BEGIN TRANSACTION;
          DECLARE @available_slots INT;
          
          -- Dùng khoá mức dòng UPDLOCK để loại trừ các Request đọc số chỗ cùng lúc
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
  ```
* **Output Mong Đợi:** Không tung ra Exception (Mã lỗi = 0), đồng thời Database trừ tự động 1 mục vào cột `available_slots`.

### 2.2. Bài toán: Màn hình Thống Kê Tổng Hợp Của Quản Trị Viên (Admin Dashboard)
* **Tình huống sử dụng:** Cung cấp thông số cho bảng Analytics của trang `/admin` ngay khi tải trang, đòi hỏi tốc độ cao và tránh việc Frontend tự cộng dồn.
* **Cách gọi từ Database:**
  ```sql
  EXEC sp_GetAdminStats;
  ```
* **Mã Nguồn CSDL:** Tổng hợp JOIN và SUM dòng tiền chỉ trong một truy vấn duy nhất.
  ```sql
  CREATE PROCEDURE sp_GetAdminStats
  AS BEGIN
      SET NOCOUNT ON;
      DECLARE @totalRoutes INT = (SELECT COUNT(*) FROM Routes);
      DECLARE @totalTrips INT = (SELECT COUNT(*) FROM Trips);
      DECLARE @totalBookings INT; DECLARE @paid INT; DECLARE @unpaid INT; DECLARE @today INT;
      
      SELECT @totalBookings = COUNT(*), @paid = SUM(CAST(is_paid AS INT)),
             @unpaid = SUM(CASE WHEN is_paid = 0 THEN 1 ELSE 0 END),
             @today = SUM(CASE WHEN CAST(created_at AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END)
      FROM Bookings;
      
      DECLARE @totalRevenue INT;
      SELECT @totalRevenue = ISNULL(SUM(t.price), 0)
      FROM Bookings b JOIN Trips t ON b.trip_id = t.trip_id WHERE b.is_paid = 1;
      
      SELECT @totalRoutes as totalRoutes, @totalTrips as totalTrips,
             ISNULL(@totalBookings, 0) as totalBookings, ISNULL(@paid, 0) as completedBookings,
             ISNULL(@unpaid, 0) as pendingBookings, ISNULL(@today, 0) as todayBookings,
             ISNULL(@totalRevenue, 0) as totalRevenue;
  END;
  ```
* **Output Mong Đợi (JSON Response):**
  ```json
  [{ "totalRoutes": 5, "totalTrips": 12, "completedBookings": 100, "totalRevenue": 15000000 }]
  ```

---

## 3. Hệ Thống 100% Stored Procedures Phần Còn Lại (CRUD APIs)

Dưới đây chi tiết mục đích áp dụng, file mã nguồn và truy vấn (Query Test) cho toàn bộ hệ sinh thái lấy và ghi dữ liệu của App.

### Nhóm 1: Quản Trị Tuyến Đường (Routes)

#### 1. Thủ tục: `sp_GetAllRoutes`
* **Sử dụng:** Chạy khi khách truy cập homepage, load dropdown danh sách các địa điểm.
* **Query Test:** `EXEC sp_GetAllRoutes;`
* **Source Code:** `CREATE PROCEDURE sp_GetAllRoutes AS BEGIN SELECT * FROM Routes; END;`
* **Output Mong Đợi:** `[ { "route_id": "HAIPHONG", "price": 169000 ... } ]`

#### 2. Thủ tục: `sp_GetRouteById`
* **Sử dụng:** Lấy chi tiết thông tin Tuyến, mô tả giá cả và hoạt động khi bấm sang trang chi tiết Tuyến.
* **Query Test:** `EXEC sp_GetRouteById @route_id = 'HAIPHONG';`
* **Source Code:** `CREATE PROCEDURE sp_GetRouteById @route_id NVARCHAR(50) AS BEGIN SELECT * FROM Routes WHERE route_id = @route_id END;`
* **Output Mong Đợi:** `[ { "route_id": "HAIPHONG", "name": "Hải Phòng", "price": 169000, "is_available": true } ]`

#### 3. Thủ tục: `sp_GetAllRouteLocations`
* **Sử dụng:** Quản trị Admin Dashboard lấy một lúc tất cả trạm dừng xe kết hợp mảng Route.
* **Query Test:** `EXEC sp_GetAllRouteLocations;`
* **Source Code:** `CREATE PROCEDURE sp_GetAllRouteLocations AS BEGIN SELECT route_id, location_name FROM RouteLocations ORDER BY route_id, stop_order; END;`
* **Output Mong Đợi:** `[ { "route_id": "HAIPHONG", "location_name": "FPT Hòa Lạc" } ]`

#### 4. Thủ tục: `sp_GetRouteLocations`
* **Sử dụng:** Khi khách hàng đặt vé và chọn Bến Đi / Bến Đến theo Option, API load mảng thả xuống của điểm dừng này.
* **Query Test:** `EXEC sp_GetRouteLocations @route_id = 'HAIPHONG';`
* **Source Code:** `CREATE PROCEDURE sp_GetRouteLocations @route_id NVARCHAR(50) AS BEGIN SELECT location_name FROM RouteLocations WHERE route_id = @route_id ORDER BY stop_order END;`
* **Output Mong Đợi:** `[ { "location_name": "FPT Hòa Lạc" } ]`


### Nhóm 2: Quản Trị Chuyến Xe (Trips)

#### 5. Thủ tục: `sp_GetTripsByRoute`
* **Sử dụng:** Giao diện đặt vé của Khách, xổ ra các chuyến đi hôm nay.
* **Query Test:** `EXEC sp_GetTripsByRoute @route_id = 'HAIPHONG';`
* **Source Code:** `CREATE PROCEDURE sp_GetTripsByRoute @route_id NVARCHAR(50) AS BEGIN SELECT * FROM Trips WHERE route_id = @route_id END;`
* **Output Mong Đợi:** `[ { "trip_id": "HP1", "departure_time": "08:30:00", "available_slots": 29 } ]`

#### 6. Thủ tục: `sp_GetAllTrips` / `sp_GetTripById`
* **Sử dụng:** Lấy Data của các chuyến đi để cho Admin xem / Check 1 chuyến trước khi thanh toán.
* **Query Test:** `EXEC sp_GetTripById @trip_id = 'HP1';`
* **Source Code:** `CREATE PROCEDURE sp_GetTripById @trip_id NVARCHAR(50) AS BEGIN SELECT t.*, r.name FROM Trips t LEFT JOIN Routes r ON t.route_id = r.route_id WHERE trip_id = @trip_id END;`
* **Output Mong Đợi:** `[ { "trip_id": "HP1", "name": "Chuyến Sáng", "available_slots": 29 } ]`

#### 7. Thủ tục: `sp_UpdateTripAdmin` (Nghiệp vụ cốt lõi Admin)
* **Sử dụng:** Trang Admin Quản Lý Chuyến Xe. Sửa các thuộc tính của chuyến đi khi bị Delay hoặc muốn thay Đổi Giá. Dùng hàm `COALESCE` thông minh để bỏ qua những trường NULL không sửa.
* **Query Test:** 
  ```sql
  EXEC sp_UpdateTripAdmin @trip_id = 'HP1', @price = 250000, @time = '10:00:00';
  ```
* **Source Code:** 
  ```sql
  CREATE PROCEDURE sp_UpdateTripAdmin
      @trip_id NVARCHAR(50), @route_id NVARCHAR(50) = NULL, @trip_date NVARCHAR(20) = NULL,
      @time NVARCHAR(10) = NULL, @price INT = NULL, @slot INT = NULL, @name NVARCHAR(100) = NULL
  AS BEGIN
      SET NOCOUNT ON;
      UPDATE Trips
      SET route_id = COALESCE(@route_id, route_id), trip_date = COALESCE(@trip_date, trip_date),
          departure_time = COALESCE(@time, departure_time), price = COALESCE(@price, price),
          available_slots = COALESCE(@slot, available_slots), name = COALESCE(@name, name)
      WHERE trip_id = @trip_id
  END;
  ```
* **Output Mong Đợi:** Code hoàn tất an toàn. Giá CSDL ở cột price update lên `250000`.


### Nhóm 3: Quản Trị Hành Khách (Users)

#### 8. Thủ tục: `sp_CreateUser`
* **Sử dụng:** Website nhận lệnh POST khi hành khách lần đầu Submit form đặt vé, insert người này vào bảng Danh Bạ Mạng (Users).
* **Query Test:** `EXEC sp_CreateUser @user_id='U001', @name='Nguyen A', @email='a@a.com', @phone='012', @sex='Nam', @destination='...', @transfer_point='...';`
* **Source Code:** `CREATE PROCEDURE sp_CreateUser ... AS BEGIN INSERT INTO Users (...) VALUES (...); END;`
* **Output Mong Đợi:** Lưu trạng thái, Data được đưa vào SQL.

#### 9. Thủ tục: `sp_GetAllUsers` / `sp_GetUserById`
* **Sử dụng:** Cho module `Admin Dashboard -> Khách Hàng` hoặc Tra cứu khách hàng theo vé trên Mobile.
* **Query Test:** `EXEC sp_GetUserById @user_id='U001';`
* **Source Code:** `CREATE PROCEDURE sp_GetUserById @user_id NVARCHAR(50) AS BEGIN SELECT * FROM Users WHERE user_id = @user_id; END;`
* **Output Mong Đợi:** `[ { "user_id": "U001", "name": "Nguyen A", "phone": "0123" } ]`

#### 10. Thủ tục: `sp_UpdateUserAdmin`
* **Sử dụng:** Giao diện cho nhân viên Sales sửa sai số điện thoại khách hàng sau khi nhận phản hồi gọi điện không nghe máy.
* **Query Test:** `EXEC sp_UpdateUserAdmin @user_id = 'U001', @phone = '0987654321';`
* **Source Code:** `CREATE PROCEDURE sp_UpdateUserAdmin @user_id NVARCHAR(50), @phone NVARCHAR(20) = NULL ... AS BEGIN UPDATE Users SET phone = COALESCE(@phone, phone) WHERE user_id = @user_id; END;`
* **Output Mong Đợi:** Dữ liệu trường SDT cập nhật đè trên csdl.


### Nhóm 4: Quản Trị Đơn Vé Mở Rộng (Bookings)

#### 11. Thủ tục: `sp_CheckBookingExists`
* **Sử dụng:** Middleware check xem vé này đã tồn tại chưa ở giai đoạn gen ID ngẫu nhiên, tránh trùng lặp Record PK.
* **Query Test:** `EXEC sp_CheckBookingExists @booking_id = 'B001';`
* **Output Mong Đợi:** `[ { "exists_val": 1 } ]` (Nếu có vé), hoặc mảng rỗng nếu vé OK để cấp phát.

#### 12. Thủ tục: `sp_GetAllBookingsDetails`
* **Sử dụng:** Giao diện hiển thị Bảng Data Table khổng lồ trên Admin Panel, JOIN thông minh từ 4 bảng để không phải gọi For LookUp trên Backend Node.js.
* **Query Test:** `EXEC sp_GetAllBookingsDetails;`
* **Source Code:** 
  ```sql
  CREATE PROCEDURE sp_GetAllBookingsDetails AS BEGIN 
      SET NOCOUNT ON; 
      SELECT b.booking_id, b.is_paid, u.name as user_name, u.phone as user_phone, 
             t.name as trip_name, t.departure_time, r.name as route_name
      FROM Bookings b
      LEFT JOIN Users u ON b.user_id = u.user_id
      LEFT JOIN Trips t ON b.trip_id = t.trip_id
      LEFT JOIN Routes r ON t.route_id = r.route_id
      ORDER BY b.created_at DESC
  END;
  ```
* **Output Mong Đợi:** 
  ```json
  [ { "booking_id": "B001", "user_name": "Nguyen A", "user_phone": "012", "trip_name": "Chuyến Sáng", "route_name": "Hải Phòng", "is_paid": true } ]
  ```

#### 13. Thủ tục: `sp_UpdateBookingAdmin`
* **Sử dụng:** Nhân viên Kế toán ấn nút "Xác Nhận Đã Thu Tiền Cọc" hoặc "Điều Chuyển Xe Limousine số 2" cho khách hàng ở giao diện backend.
* **Query Test:** 
  ```sql
  EXEC sp_UpdateBookingAdmin @booking_id = 'B001', @is_paid = 1, @bus_id = 'BUS2';
  ```
* **Source Code:** `CREATE PROCEDURE sp_UpdateBookingAdmin ... AS BEGIN UPDATE Bookings SET is_paid = COALESCE(@is_paid, is_paid), bus_id = COALESCE(@bus_id, bus_id) WHERE booking_id = @booking_id; END;`
* **Output Mong Đợi:** Status của khách chuyển sang đã thu phí.

#### 14. Thủ tục: `sp_CheckInBooking`
* **Sử dụng:** Chuyến xe bắt đầu khởi hành, Lái Xe cầm máy điện thoại quét mã QR Code trên cửa sổ người dùng để Check-In và ghi nhận giờ họ bước lên xe.
* **Query Test:** 
  ```sql
  EXEC sp_CheckInBooking @booking_id = 'B001', @checkin_time = '2026-03-22 08:35:00';
  ```
* **Source Code:** `CREATE PROCEDURE sp_CheckInBooking ... AS BEGIN UPDATE Bookings SET is_checked_in = 1, checkin_time = @checkin_time WHERE booking_id = @booking_id END;`
* **Output Mong Đợi:** Lượt đi biến thành vé hợp lệ hoàn toàn (Xanh trên App nhân viên quét).

#### 15. Thủ tục: `sp_AdminLogin`
* **Sử dụng:** Quản trị đăng nhập hệ thống nội bộ của doanh nghiệp bằng Data đối chiếu lấy từ SQL thay cho Firebase.
* **Query Test:** 
  ```sql
  EXEC sp_AdminLogin @email = 'admin@holabus.com', @password = 'holabus2025';
  ```
* **Source Code:** `CREATE PROCEDURE sp_AdminLogin ... AS BEGIN SELECT email FROM Admins WHERE email = @email AND password_hash = @password END;`
* **Output Mong Đợi:** Nếu trả về `[ { "email": "admin@holabus.com" } ]`, xác thực thành công.

---

## Tổng Kết

Mô hình hiện tại của HolaBus đã **hiện thực hóa 100% việc dời Business Logic xuống Database**.
- Ở Backend Node.js / App Next.js: Hoàn toàn không tìm thấy một chữ `INSERT` hay `UPDATE` nào, thay vào đó là gọi `pool.request().execute('sp_Name')`.
- Vấn đề hiệu năng: Giảm tải cực lớn cho Data Fetching vì không còn phải kéo hàng nghìn record về RAM Server để map/filter mà SQL Server (JOIN) lo hết.
- Vấn đề bảo mật: SQL Injection không thể xảy ra đối với cấu trúc chuẩn truyền `Input` qua thủ tục lưu trữ trong SQL.
