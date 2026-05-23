-- ============================================================
-- HỆ THỐNG QUẢN LÝ XE BUÝT TRƯỜNG HỌC (CNPM)
-- Database: cnpm
-- Charset: utf8mb4 (hỗ trợ tiếng Việt đầy đủ)
-- Tạo từ: phân tích backend Node.js (models + services)
-- Ngày tạo: 2026-05-22
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET collation_connection = 'utf8mb4_unicode_ci';

-- Tắt kiểm tra khóa ngoại để tạo bảng không bị lỗi thứ tự
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- Tạo và chọn database
-- ============================================================
CREATE DATABASE IF NOT EXISTS `cnpm`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `cnpm`;

-- ============================================================
-- 1. Bảng USER (tài khoản hệ thống)
--    Roles: admin | driver | parent
-- ============================================================
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id`       INT          NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(100) NOT NULL COMMENT 'Họ và tên người dùng',
  `email`         VARCHAR(150) NOT NULL UNIQUE COMMENT 'Email đăng nhập',
  `phone`         VARCHAR(15)           COMMENT 'Số điện thoại',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu đã hash (bcrypt)',
  `role`          ENUM('admin','driver','parent') NOT NULL DEFAULT 'parent' COMMENT 'Vai trò người dùng',
  `url_img`       VARCHAR(500)          COMMENT 'Đường dẫn ảnh đại diện',
  `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo tài khoản',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Tài khoản người dùng hệ thống';


-- ============================================================
-- 2. Bảng PARENT (phụ huynh học sinh)
--    Liên kết 1-1 với user
-- ============================================================
DROP TABLE IF EXISTS `parent`;
CREATE TABLE `parent` (
  `parent_id`  INT          NOT NULL AUTO_INCREMENT,
  `user_id`    INT          NOT NULL COMMENT 'FK → user.user_id',
  `parent_name` VARCHAR(100)         COMMENT 'Tên phụ huynh (dùng trong các join query)',
  `address`    VARCHAR(300)          COMMENT 'Địa chỉ nhà',
  `occupation` VARCHAR(150)          COMMENT 'Nghề nghiệp',
  PRIMARY KEY (`parent_id`),
  UNIQUE KEY `uq_parent_user` (`user_id`),
  CONSTRAINT `fk_parent_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Thông tin phụ huynh học sinh';


-- ============================================================
-- 3. Bảng ROUTE (tuyến xe)
-- ============================================================
DROP TABLE IF EXISTS `route`;
CREATE TABLE `route` (
  `route_id`       INT          NOT NULL AUTO_INCREMENT,
  `route_name`     VARCHAR(200) NOT NULL COMMENT 'Tên tuyến đường',
  `distance_km`    DECIMAL(8,2)          COMMENT 'Khoảng cách (km)',
  `estimated_time` INT                   COMMENT 'Thời gian ước tính (phút)',
  `status`         ENUM('active','inactive') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái tuyến',
  PRIMARY KEY (`route_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Danh sách tuyến xe';


-- ============================================================
-- 4. Bảng PICKUPDROPOFFPOINT (điểm đón/trả)
--    Soft delete: is_delete = '0' (chưa xóa) / '1' (đã xóa)
-- ============================================================
DROP TABLE IF EXISTS `pickupdropoffpoint`;
CREATE TABLE `pickupdropoffpoint` (
  `point_id`      INT          NOT NULL AUTO_INCREMENT,
  `route_id`      INT          NOT NULL COMMENT 'FK → route.route_id',
  `point_name`    VARCHAR(300) NOT NULL COMMENT 'Tên điểm đón/trả (tiếng Việt)',
  `latitude`      DECIMAL(10,7)         COMMENT 'Vĩ độ (GPS)',
  `longitude`     DECIMAL(10,7)         COMMENT 'Kinh độ (GPS)',
  `order_in_route` INT         NOT NULL DEFAULT 0 COMMENT 'Thứ tự trong tuyến',
  `is_delete`     CHAR(1)      NOT NULL DEFAULT '0' COMMENT 'Xóa mềm: 0=chưa xóa, 1=đã xóa',
  PRIMARY KEY (`point_id`),
  KEY `idx_pdp_route` (`route_id`),
  KEY `idx_pdp_is_delete` (`is_delete`),
  CONSTRAINT `fk_pdp_route`
    FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Điểm đón và trả học sinh trên tuyến';


-- ============================================================
-- 5. Bảng STUDENT (học sinh)
-- ============================================================
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `student_id`       INT          NOT NULL AUTO_INCREMENT,
  `student_name`     VARCHAR(150) NOT NULL COMMENT 'Họ và tên học sinh',
  `date_of_birth`    DATE                  COMMENT 'Ngày sinh',
  `parent_id`        INT          NOT NULL COMMENT 'FK → parent.parent_id',
  `pickup_point_id`  INT                   COMMENT 'FK → pickupdropoffpoint.point_id (điểm đón)',
  `dropoff_point_id` INT                   COMMENT 'FK → pickupdropoffpoint.point_id (điểm trả)',
  `pickuptime`       TIME                  COMMENT 'Giờ đón dự kiến',
  `dropofftime`      TIME                  COMMENT 'Giờ trả dự kiến',
  `status`           ENUM('active','inactive','graduated') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái học sinh',
  PRIMARY KEY (`student_id`),
  KEY `idx_student_parent` (`parent_id`),
  KEY `idx_student_pickup` (`pickup_point_id`),
  KEY `idx_student_dropoff` (`dropoff_point_id`),
  CONSTRAINT `fk_student_parent`
    FOREIGN KEY (`parent_id`) REFERENCES `parent` (`parent_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_student_pickup`
    FOREIGN KEY (`pickup_point_id`) REFERENCES `pickupdropoffpoint` (`point_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_student_dropoff`
    FOREIGN KEY (`dropoff_point_id`) REFERENCES `pickupdropoffpoint` (`point_id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Danh sách học sinh';


-- ============================================================
-- 6. Bảng BUS (xe buýt)
-- ============================================================
DROP TABLE IF EXISTS `bus`;
CREATE TABLE `bus` (
  `bus_id`       INT          NOT NULL AUTO_INCREMENT,
  `plate_number` VARCHAR(20)  NOT NULL UNIQUE COMMENT 'Biển số xe',
  `capacity`     INT          NOT NULL DEFAULT 0 COMMENT 'Sức chứa (số học sinh)',
  `model`        VARCHAR(150)           COMMENT 'Model / nhãn hiệu xe',
  `status`       ENUM('active','inactive','maintenance') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái xe',
  `route_id`     INT                    COMMENT 'FK → route.route_id (tuyến được phân công)',
  `start_time`   TIME                   COMMENT 'Giờ xuất phát',
  PRIMARY KEY (`bus_id`),
  KEY `idx_bus_route` (`route_id`),
  CONSTRAINT `fk_bus_route`
    FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Danh sách xe buýt trường học';


-- ============================================================
-- 7. Bảng DRIVER (tài xế)
-- ============================================================
DROP TABLE IF EXISTS `driver`;
CREATE TABLE `driver` (
  `driver_id`   INT          NOT NULL AUTO_INCREMENT,
  `driver_name` VARCHAR(100) NOT NULL COMMENT 'Họ và tên tài xế',
  `phone`       VARCHAR(15)           COMMENT 'Số điện thoại',
  `user_id`     INT                   COMMENT 'FK → user.user_id (tài khoản đăng nhập)',
  `bus_id`      INT                   COMMENT 'FK → bus.bus_id (xe được phân công)',
  `status`      ENUM('active','inactive','on_leave') NOT NULL DEFAULT 'active' COMMENT 'Trạng thái tài xế',
  PRIMARY KEY (`driver_id`),
  KEY `idx_driver_user` (`user_id`),
  KEY `idx_driver_bus` (`bus_id`),
  CONSTRAINT `fk_driver_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_driver_bus`
    FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Danh sách tài xế';


-- ============================================================
-- 8. Bảng SCHOOLYEAR (năm học)
-- ============================================================
DROP TABLE IF EXISTS `schoolyear`;
CREATE TABLE `schoolyear` (
  `year_id`    INT          NOT NULL AUTO_INCREMENT,
  `year_name`  VARCHAR(20)  NOT NULL COMMENT 'Tên năm học, vd: 2025-2026',
  `start_date` DATE         NOT NULL COMMENT 'Ngày bắt đầu năm học',
  `end_date`   DATE         NOT NULL COMMENT 'Ngày kết thúc năm học',
  PRIMARY KEY (`year_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Năm học';


-- ============================================================
-- 9. Bảng TRIP (chuyến đi)
-- ============================================================
DROP TABLE IF EXISTS `trip`;
CREATE TABLE `trip` (
  `trip_id`    INT      NOT NULL AUTO_INCREMENT,
  `driver_id`  INT               COMMENT 'FK → driver.driver_id',
  `bus_id`     INT               COMMENT 'FK → bus.bus_id',
  `route_id`   INT               COMMENT 'FK → route.route_id',
  `year_id`    INT               COMMENT 'FK → schoolyear.year_id',
  `trip_date`  DATE     NOT NULL COMMENT 'Ngày thực hiện chuyến',
  `start_time` TIME              COMMENT 'Giờ khởi hành',
  `end_time`   TIME              COMMENT 'Giờ kết thúc',
  `status`     ENUM('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái chuyến đi',
  PRIMARY KEY (`trip_id`),
  KEY `idx_trip_driver` (`driver_id`),
  KEY `idx_trip_bus` (`bus_id`),
  KEY `idx_trip_route` (`route_id`),
  KEY `idx_trip_year` (`year_id`),
  KEY `idx_trip_date` (`trip_date`),
  CONSTRAINT `fk_trip_driver`
    FOREIGN KEY (`driver_id`) REFERENCES `driver` (`driver_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_trip_bus`
    FOREIGN KEY (`bus_id`) REFERENCES `bus` (`bus_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_trip_route`
    FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_trip_year`
    FOREIGN KEY (`year_id`) REFERENCES `schoolyear` (`year_id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Chuyến đi hàng ngày';


-- ============================================================
-- 10. Bảng DETAILTRIP (chi tiết chuyến – điểm danh học sinh)
-- ============================================================
DROP TABLE IF EXISTS `detailtrip`;
CREATE TABLE `detailtrip` (
  `detail_id`       INT  NOT NULL AUTO_INCREMENT,
  `trip_id`         INT           COMMENT 'FK → trip.trip_id',
  `student_id`      INT           COMMENT 'FK → student.student_id',
  `pickup_time`     DATETIME      COMMENT 'Thời gian thực tế đón học sinh',
  `dropoff_time`    DATETIME      COMMENT 'Thời gian thực tế trả học sinh',
  `status`          ENUM('waiting','picked_up','dropped_off','absent') NOT NULL DEFAULT 'waiting' COMMENT 'Trạng thái điểm danh',
  `pickup_point_id`  INT           COMMENT 'FK → pickupdropoffpoint.point_id (điểm đón thực tế)',
  `dropoff_point_id` INT           COMMENT 'FK → pickupdropoffpoint.point_id (điểm trả thực tế)',
  PRIMARY KEY (`detail_id`),
  KEY `idx_dt_trip` (`trip_id`),
  KEY `idx_dt_student` (`student_id`),
  KEY `idx_dt_pickup_pt` (`pickup_point_id`),
  KEY `idx_dt_dropoff_pt` (`dropoff_point_id`),
  CONSTRAINT `fk_dt_trip`
    FOREIGN KEY (`trip_id`) REFERENCES `trip` (`trip_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_dt_student`
    FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_dt_pickup_pt`
    FOREIGN KEY (`pickup_point_id`) REFERENCES `pickupdropoffpoint` (`point_id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_dt_dropoff_pt`
    FOREIGN KEY (`dropoff_point_id`) REFERENCES `pickupdropoffpoint` (`point_id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Chi tiết điểm danh từng học sinh trong mỗi chuyến';


-- ============================================================
-- 11. Bảng INCIDENT (sự cố trên xe)
-- ============================================================
DROP TABLE IF EXISTS `incident`;
CREATE TABLE `incident` (
  `incident_id`   INT          NOT NULL AUTO_INCREMENT,
  `trip_id`       INT          NOT NULL COMMENT 'FK → trip.trip_id',
  `description`   TEXT                  COMMENT 'Mô tả sự cố',
  `incident_time` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm xảy ra sự cố',
  `severity`      ENUM('low','medium','high','critical') NOT NULL DEFAULT 'low' COMMENT 'Mức độ nghiêm trọng',
  PRIMARY KEY (`incident_id`),
  KEY `idx_incident_trip` (`trip_id`),
  CONSTRAINT `fk_incident_trip`
    FOREIGN KEY (`trip_id`) REFERENCES `trip` (`trip_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Sự cố xảy ra trong chuyến đi';


-- ============================================================
-- 12. Bảng NOTIFICATION (thông báo hệ thống)
-- ============================================================
DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification` (
  `notifi_id`  INT          NOT NULL AUTO_INCREMENT,
  `title`      VARCHAR(300) NOT NULL COMMENT 'Tiêu đề thông báo',
  `message`    TEXT                  COMMENT 'Nội dung thông báo',
  `type`       VARCHAR(50)           COMMENT 'Loại thông báo (info, warning, alert, ...)',
  `created_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm tạo thông báo',
  PRIMARY KEY (`notifi_id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Thông báo hệ thống';


-- ============================================================
-- 13. Bảng NOTIFICATIONTOUSER (gửi thông báo tới người dùng)
-- ============================================================
DROP TABLE IF EXISTS `notificationtouser`;
CREATE TABLE `notificationtouser` (
  `notificationtouser_id` INT  NOT NULL AUTO_INCREMENT,
  `notifi_id`             INT  NOT NULL COMMENT 'FK → notification.notifi_id',
  `user_id`               INT  NOT NULL COMMENT 'FK → user.user_id',
  `is_read`               TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0=chưa đọc, 1=đã đọc',
  PRIMARY KEY (`notificationtouser_id`),
  KEY `idx_ntu_notifi` (`notifi_id`),
  KEY `idx_ntu_user` (`user_id`),
  CONSTRAINT `fk_ntu_notifi`
    FOREIGN KEY (`notifi_id`) REFERENCES `notification` (`notifi_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ntu_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Ánh xạ thông báo đến người dùng';


-- ============================================================
-- 14. Bảng MESSAGE (tin nhắn nội bộ)
-- ============================================================
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `mess_id`   INT      NOT NULL AUTO_INCREMENT,
  `user_id`   INT      NOT NULL COMMENT 'FK → user.user_id (người nhận)',
  `sender_id` INT      NOT NULL COMMENT 'FK → user.user_id (người gửi)',
  `content`   TEXT     NOT NULL COMMENT 'Nội dung tin nhắn',
  `sent_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm gửi',
  `is_read`   TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0=chưa đọc, 1=đã đọc',
  PRIMARY KEY (`mess_id`),
  KEY `idx_msg_user` (`user_id`),
  KEY `idx_msg_sender` (`sender_id`),
  CONSTRAINT `fk_msg_user`
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_msg_sender`
    FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Tin nhắn nội bộ giữa người dùng';


-- ============================================================
-- Bật lại kiểm tra khóa ngoại
-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;


-- ============================================================
-- DỮ LIỆU MẪU (Sample Data) – để test hệ thống
-- ============================================================

-- Năm học mẫu
INSERT INTO `schoolyear` (`year_name`, `start_date`, `end_date`) VALUES
  ('2024-2025', '2024-09-02', '2025-05-31'),
  ('2025-2026', '2025-09-01', '2026-05-30');

-- Tuyến xe mẫu
INSERT INTO `route` (`route_name`, `distance_km`, `estimated_time`, `status`) VALUES
  ('Tuyến 1 - Quận 1 → Trường', 12.5, 35, 'active'),
  ('Tuyến 2 - Quận 7 → Trường', 18.0, 50, 'active'),
  ('Tuyến 3 - Bình Thạnh → Trường', 10.0, 30, 'active');

-- Điểm đón mẫu trên Tuyến 1
INSERT INTO `pickupdropoffpoint` (`route_id`, `point_name`, `latitude`, `longitude`, `order_in_route`, `is_delete`) VALUES
  (1, 'Trạm 1 - Ngã tư Lê Lợi & Nguyễn Huệ, Q.1',       10.7769000, 106.7009000, 1, '0'),
  (1, 'Trạm 2 - Công viên Tao Đàn, Q.1',                   10.7741000, 106.6922000, 2, '0'),
  (1, 'Trạm 3 - Điểm cuối - Cổng trường',                  10.8200000, 106.6800000, 3, '0'),
  (2, 'Trạm 1 - Vivo City, Quận 7',                        10.7285000, 106.7177000, 1, '0'),
  (2, 'Trạm 2 - Cầu Kênh Tẻ, Quận 4',                     10.7553000, 106.7042000, 2, '0'),
  (2, 'Trạm 3 - Điểm cuối - Cổng trường',                  10.8200000, 106.6800000, 3, '0');

-- Tài khoản mẫu (password: 'Admin@123' – đã hash bcrypt)
INSERT INTO `user` (`name`, `email`, `phone`, `password_hash`, `role`, `url_img`) VALUES
  ('Nguyễn Văn Admin', 'admin@school.edu.vn',    '0900000001',
   '$2b$10$examplehashforAdminxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'admin',  NULL),
  ('Trần Văn Tài',     'driver1@school.edu.vn',  '0900000002',
   '$2b$10$examplehashforDriverxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1', 'driver', NULL),
  ('Lê Thị Bình',      'driver2@school.edu.vn',  '0900000003',
   '$2b$10$examplehashforDriverxxxxxxxxxxxxxxxxxxxxxxxxxxxxx2', 'driver', NULL),
  ('Phạm Thị Hoa',     'parent1@gmail.com',       '0900000010',
   '$2b$10$examplehashforParentxxxxxxxxxxxxxxxxxxxxxxxxxxxxx1', 'parent', NULL),
  ('Nguyễn Minh Tuấn', 'parent2@gmail.com',       '0900000011',
   '$2b$10$examplehashforParentxxxxxxxxxxxxxxxxxxxxxxxxxxxxx2', 'parent', NULL);

-- Xe buýt mẫu
INSERT INTO `bus` (`plate_number`, `capacity`, `model`, `status`, `route_id`, `start_time`) VALUES
  ('51B-12345', 35, 'Thaco TB79', 'active', 1, '06:30:00'),
  ('51B-67890', 35, 'Thaco TB79', 'active', 2, '06:45:00'),
  ('51C-11111', 30, 'Hyundai County', 'active', 3, '07:00:00');

-- Tài xế mẫu
INSERT INTO `driver` (`driver_name`, `phone`, `user_id`, `bus_id`, `status`) VALUES
  ('Trần Văn Tài', '0900000002', 2, 1, 'active'),
  ('Lê Thị Bình',  '0900000003', 3, 2, 'active');

-- Phụ huynh mẫu
INSERT INTO `parent` (`user_id`, `parent_name`, `address`, `occupation`) VALUES
  (4, 'Phạm Thị Hoa',     '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',   'Giáo viên'),
  (5, 'Nguyễn Minh Tuấn', '456 Nguyễn Văn Linh, Phường Tân Phú, Quận 7, TP.HCM', 'Kỹ sư');

-- Học sinh mẫu
INSERT INTO `student` (`student_name`, `date_of_birth`, `parent_id`, `pickup_point_id`, `dropoff_point_id`, `pickuptime`, `dropofftime`, `status`) VALUES
  ('Phạm Bảo An',   '2018-03-15', 1, 1, 3, '06:30:00', '16:30:00', 'active'),
  ('Phạm Bảo Ngọc', '2019-07-20', 1, 2, 3, '06:30:00', '16:30:00', 'active'),
  ('Nguyễn Minh Khôi', '2017-11-05', 2, 4, 6, '06:45:00', '16:45:00', 'active');

-- Thông báo mẫu
INSERT INTO `notification` (`title`, `message`, `type`) VALUES
  ('Thông báo nghỉ lễ', 'Nhà trường thông báo nghỉ lễ 30/4 - 1/5 từ ngày 28/04/2026 đến 02/05/2026.', 'info'),
  ('Cảnh báo thời tiết', 'Dự báo mưa lớn ngày mai, xe có thể đến trễ 10-15 phút. Phụ huynh lưu ý!', 'warning');

-- Gửi thông báo đến phụ huynh
INSERT INTO `notificationtouser` (`notifi_id`, `user_id`, `is_read`) VALUES
  (1, 4, 0),
  (1, 5, 0),
  (2, 4, 0),
  (2, 5, 1);

-- ============================================================
-- KIỂM TRA CẤU TRÚC
-- ============================================================
-- SELECT TABLE_NAME, TABLE_COMMENT
-- FROM information_schema.TABLES
-- WHERE TABLE_SCHEMA = 'cnpm'
-- ORDER BY TABLE_NAME;
