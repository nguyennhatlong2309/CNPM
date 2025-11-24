-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2025 at 06:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cnpm`
--

-- --------------------------------------------------------

--
-- Table structure for table `chitietchuyendi`
--

CREATE TABLE `chitietchuyendi` (
  `MACD` varchar(10) NOT NULL,
  `MAHS` varchar(10) NOT NULL,
  `status` enum('pending','picked','dropped') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chitietchuyendi`
--

INSERT INTO `chitietchuyendi` (`MACD`, `MAHS`, `status`) VALUES
('CD01', 'HS01', 'pending'),
('CD01', 'HS02', 'pending'),
('CD01', 'HS03', 'pending'),
('CD01', 'HS04', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `chuyendi`
--

CREATE TABLE `chuyendi` (
  `MACD` varchar(10) NOT NULL,
  `batdau` datetime DEFAULT NULL,
  `ketthuc` datetime DEFAULT NULL,
  `trangthai` varchar(10) DEFAULT NULL,
  `MAPC` varchar(10) DEFAULT NULL,
  `MALC` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chuyendi`
--

INSERT INTO `chuyendi` (`MACD`, `batdau`, `ketthuc`, `trangthai`, `MAPC`, `MALC`) VALUES
('CD01', '2025-11-17 06:30:00', '2025-11-17 07:20:00', 'hoanthanh', 'PC01', 'LC01'),
('CD02', '2025-11-17 06:05:00', '2025-11-17 07:10:00', 'hoanthanh', 'PC02', 'LC02');

-- --------------------------------------------------------

--
-- Table structure for table `diemdung`
--

CREATE TABLE `diemdung` (
  `MaDiemDung` varchar(10) NOT NULL,
  `Tendiemdung` varchar(50) DEFAULT NULL,
  `Vitri` varchar(200) DEFAULT NULL,
  `MaTuyen` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `diemdung`
--

INSERT INTO `diemdung` (`MaDiemDung`, `Tendiemdung`, `Vitri`, `MaTuyen`) VALUES
('DD01', 'Điểm 1', '50 Trường Sơn, Phường 2, Tân Bình, TP.HCM', 'T1'),
('DD02', 'Điểm 2', '123 Nguyễn Văn Trỗi, Phường 12, Phú Nhuận, TP.HCM', 'T1'),
('DD03', 'Điểm 3', '290 Nam Kỳ Khởi Nghĩa, Phường 8, Quận 3, TP.HCM', 'T1'),
('DD04', 'Điểm 4', '65 Nam Kỳ Khởi Nghĩa, Bến Nghé, Quận 1, TP.HCM', 'T1');

-- --------------------------------------------------------

--
-- Table structure for table `hocsinh`
--

CREATE TABLE `hocsinh` (
  `MAHS` varchar(10) NOT NULL,
  `TenHS` varchar(50) DEFAULT NULL,
  `Lop` varchar(10) DEFAULT NULL,
  `MAPH` varchar(10) DEFAULT NULL,
  `MaDiemDung` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hocsinh`
--

INSERT INTO `hocsinh` (`MAHS`, `TenHS`, `Lop`, `MAPH`, `MaDiemDung`) VALUES
('HS01', 'Nguyen Tuan Kiet', '6A1', 'PH01', 'DD01'),
('HS02', 'Tran Bao Nhi', '7B2', 'PH01', 'DD02'),
('HS03', 'Nguyen Hoang Long', '8C3', 'PH02', 'DD04'),
('HS04', 'Le Thi Mai', '6A2', 'PH02', 'DD03');

-- --------------------------------------------------------

--
-- Table structure for table `lichtrinh`
--

CREATE TABLE `lichtrinh` (
  `MALC` varchar(10) NOT NULL,
  `batdau` datetime DEFAULT NULL,
  `ketthuc` datetime DEFAULT NULL,
  `ngaytrongtuan` varchar(20) DEFAULT NULL,
  `MaTuyen` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lichtrinh`
--

INSERT INTO `lichtrinh` (`MALC`, `batdau`, `ketthuc`, `ngaytrongtuan`, `MaTuyen`) VALUES
('LC01', '2025-11-17 06:30:00', '2025-11-17 07:30:00', 'Thứ 2', 'T1'),
('LC02', '2025-11-17 06:00:00', '2025-11-17 07:00:00', 'Thứ 2', 'T2');

-- --------------------------------------------------------

--
-- Table structure for table `phancong`
--

CREATE TABLE `phancong` (
  `MAPC` varchar(10) NOT NULL,
  `batdau` datetime DEFAULT NULL,
  `ketthuc` datetime DEFAULT NULL,
  `MaTuyen` varchar(10) DEFAULT NULL,
  `MALC` varchar(10) DEFAULT NULL,
  `MAXE` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phancong`
--

INSERT INTO `phancong` (`MAPC`, `batdau`, `ketthuc`, `MaTuyen`, `MALC`, `MAXE`) VALUES
('PC01', '2025-11-17 06:00:00', '2025-11-17 08:00:00', 'T1', 'LC01', 'XE01'),
('PC02', '2025-11-17 05:45:00', '2025-11-17 07:30:00', 'T2', 'LC02', 'XE02');

-- --------------------------------------------------------

--
-- Table structure for table `phuhuynh`
--

CREATE TABLE `phuhuynh` (
  `MAPH` varchar(10) NOT NULL,
  `TenPH` varchar(50) DEFAULT NULL,
  `SDT` varchar(10) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phuhuynh`
--

INSERT INTO `phuhuynh` (`MAPH`, `TenPH`, `SDT`, `Email`) VALUES
('PH01', 'Nguyen Van A', '0901234567', 'a@gmail.com'),
('PH02', 'Tran Thi B', '0907654321', 'b@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `taixe`
--

CREATE TABLE `taixe` (
  `MATX` varchar(10) NOT NULL,
  `TenTX` varchar(50) DEFAULT NULL,
  `SDT` varchar(10) DEFAULT NULL,
  `giayphep` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `taixe`
--

INSERT INTO `taixe` (`MATX`, `TenTX`, `SDT`, `giayphep`) VALUES
('TX01', 'Le Minh Hung', '0912345678', 'GPLX-B1'),
('TX02', 'Pham Van Son', '0938765432', 'GPLX-D');

-- --------------------------------------------------------

--
-- Table structure for table `thongbao`
--

CREATE TABLE `thongbao` (
  `MATB` varchar(10) NOT NULL,
  `noidung` varchar(200) DEFAULT NULL,
  `loaiTB` enum('canhbao','thongtin','khac') DEFAULT NULL,
  `thoigian` datetime DEFAULT NULL,
  `trangthai` enum('dagui','chuagui') DEFAULT NULL,
  `nguoinhanloai` enum('phuhuynh','taixe') DEFAULT NULL,
  `MAPH` varchar(10) DEFAULT NULL,
  `MATX` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `thongbao`
--

INSERT INTO `thongbao` (`MATB`, `noidung`, `loaiTB`, `thoigian`, `trangthai`, `nguoinhanloai`, `MAPH`, `MATX`) VALUES
('TB01', 'Xe sắp đến điểm đón', 'thongtin', '2025-11-17 06:25:00', 'dagui', 'phuhuynh', 'PH01', NULL),
('TB02', 'Học sinh đã lên xe an toàn', 'thongtin', '2025-11-17 06:40:00', 'dagui', 'phuhuynh', 'PH02', NULL),
('TB19736837', 'Bao cao: ky_thuat', 'canhbao', '2025-11-21 17:08:56', 'dagui', 'phuhuynh', NULL, 'TX01'),
('TB20091272', 'Bao cao: khac', 'canhbao', '2025-11-21 17:14:51', 'dagui', 'phuhuynh', NULL, 'TX01'),
('TB20094413', 'Bao cao: khac', 'canhbao', '2025-11-21 17:14:54', 'dagui', 'phuhuynh', NULL, 'TX01'),
('TB20094573', 'Bao cao: khac', 'canhbao', '2025-11-21 17:14:54', 'dagui', 'phuhuynh', NULL, 'TX01'),
('TB20094948', 'Bao cao: tai_nan', 'canhbao', '2025-11-21 17:14:54', 'dagui', 'phuhuynh', NULL, 'TX01'),
('TB20095260', 'Bao cao: tai_nan', 'canhbao', '2025-11-21 17:14:55', 'dagui', 'phuhuynh', NULL, 'TX01'),
('TB20095405', 'Bao cao: tai_nan', 'canhbao', '2025-11-21 17:14:55', 'dagui', 'phuhuynh', NULL, 'TX01'),
('TB20103354', 'x', 'khac', '2025-11-21 17:15:03', 'dagui', 'phuhuynh', NULL, 'TX01'),
('TB20105381', 'Bao cao: tac_duong', 'canhbao', '2025-11-21 17:15:05', 'dagui', 'phuhuynh', NULL, 'TX01'),
('TB20107151', 'a', 'khac', '2025-11-21 17:15:07', 'dagui', 'phuhuynh', NULL, 'TX01'),
('TB21466231', 'Bao cao: tac_duong', 'canhbao', '2025-11-21 17:37:46', 'dagui', 'phuhuynh', NULL, 'TX01');

-- --------------------------------------------------------

--
-- Table structure for table `tuyenduong`
--

CREATE TABLE `tuyenduong` (
  `MaTuyen` varchar(10) NOT NULL,
  `Tentuyen` varchar(50) DEFAULT NULL,
  `Mota` varchar(50) DEFAULT NULL,
  `MAXE` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tuyenduong`
--

INSERT INTO `tuyenduong` (`MaTuyen`, `Tentuyen`, `Mota`, `MAXE`) VALUES
('T1', 'Tuyến Quận Tân Bình → Quận 1', '', 'XE01'),
('T2', 'Tuyến Thủ Đức → Quận 3', 'Đi theo Xa Lộ Hà Nội', 'XE02');

-- --------------------------------------------------------

--
-- Table structure for table `xebuyt`
--

CREATE TABLE `xebuyt` (
  `MAXE` varchar(10) NOT NULL,
  `biensoxe` varchar(50) DEFAULT NULL,
  `trangthai` varchar(10) DEFAULT NULL,
  `MATX` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `xebuyt`
--

INSERT INTO `xebuyt` (`MAXE`, `biensoxe`, `trangthai`, `MATX`) VALUES
('XE01', '51A-12345', 'dangchay', 'TX01'),
('XE02', '51A-67890', 'dangchay', 'TX02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chitietchuyendi`
--
ALTER TABLE `chitietchuyendi`
  ADD PRIMARY KEY (`MACD`,`MAHS`),
  ADD KEY `MAHS` (`MAHS`);

--
-- Indexes for table `chuyendi`
--
ALTER TABLE `chuyendi`
  ADD PRIMARY KEY (`MACD`),
  ADD KEY `MAPC` (`MAPC`),
  ADD KEY `MALC` (`MALC`);

--
-- Indexes for table `diemdung`
--
ALTER TABLE `diemdung`
  ADD PRIMARY KEY (`MaDiemDung`),
  ADD KEY `MaTuyen` (`MaTuyen`);

--
-- Indexes for table `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD PRIMARY KEY (`MAHS`),
  ADD KEY `MAPH` (`MAPH`),
  ADD KEY `MaDiemDung` (`MaDiemDung`);

--
-- Indexes for table `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD PRIMARY KEY (`MALC`),
  ADD KEY `MaTuyen` (`MaTuyen`);

--
-- Indexes for table `phancong`
--
ALTER TABLE `phancong`
  ADD PRIMARY KEY (`MAPC`),
  ADD KEY `MaTuyen` (`MaTuyen`),
  ADD KEY `MALC` (`MALC`),
  ADD KEY `MAXE` (`MAXE`);

--
-- Indexes for table `phuhuynh`
--
ALTER TABLE `phuhuynh`
  ADD PRIMARY KEY (`MAPH`);

--
-- Indexes for table `taixe`
--
ALTER TABLE `taixe`
  ADD PRIMARY KEY (`MATX`);

--
-- Indexes for table `thongbao`
--
ALTER TABLE `thongbao`
  ADD PRIMARY KEY (`MATB`),
  ADD KEY `MAPH` (`MAPH`),
  ADD KEY `MATX` (`MATX`);

--
-- Indexes for table `tuyenduong`
--
ALTER TABLE `tuyenduong`
  ADD PRIMARY KEY (`MaTuyen`),
  ADD KEY `MAXE` (`MAXE`);

--
-- Indexes for table `xebuyt`
--
ALTER TABLE `xebuyt`
  ADD PRIMARY KEY (`MAXE`),
  ADD KEY `MATX` (`MATX`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chitietchuyendi`
--
ALTER TABLE `chitietchuyendi`
  ADD CONSTRAINT `chitietchuyendi_ibfk_1` FOREIGN KEY (`MACD`) REFERENCES `chuyendi` (`MACD`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chitietchuyendi_ibfk_2` FOREIGN KEY (`MAHS`) REFERENCES `hocsinh` (`MAHS`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `chuyendi`
--
ALTER TABLE `chuyendi`
  ADD CONSTRAINT `chuyendi_ibfk_1` FOREIGN KEY (`MAPC`) REFERENCES `phancong` (`MAPC`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `chuyendi_ibfk_2` FOREIGN KEY (`MALC`) REFERENCES `lichtrinh` (`MALC`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `diemdung`
--
ALTER TABLE `diemdung`
  ADD CONSTRAINT `diemdung_ibfk_1` FOREIGN KEY (`MaTuyen`) REFERENCES `tuyenduong` (`MaTuyen`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `hocsinh`
--
ALTER TABLE `hocsinh`
  ADD CONSTRAINT `hocsinh_ibfk_1` FOREIGN KEY (`MAPH`) REFERENCES `phuhuynh` (`MAPH`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `hocsinh_ibfk_2` FOREIGN KEY (`MaDiemDung`) REFERENCES `diemdung` (`MaDiemDung`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `lichtrinh`
--
ALTER TABLE `lichtrinh`
  ADD CONSTRAINT `lichtrinh_ibfk_1` FOREIGN KEY (`MaTuyen`) REFERENCES `tuyenduong` (`MaTuyen`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `phancong`
--
ALTER TABLE `phancong`
  ADD CONSTRAINT `phancong_ibfk_1` FOREIGN KEY (`MaTuyen`) REFERENCES `tuyenduong` (`MaTuyen`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `phancong_ibfk_2` FOREIGN KEY (`MALC`) REFERENCES `lichtrinh` (`MALC`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `phancong_ibfk_3` FOREIGN KEY (`MAXE`) REFERENCES `xebuyt` (`MAXE`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `thongbao`
--
ALTER TABLE `thongbao`
  ADD CONSTRAINT `thongbao_ibfk_1` FOREIGN KEY (`MAPH`) REFERENCES `phuhuynh` (`MAPH`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `thongbao_ibfk_2` FOREIGN KEY (`MATX`) REFERENCES `taixe` (`MATX`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tuyenduong`
--
ALTER TABLE `tuyenduong`
  ADD CONSTRAINT `tuyenduong_ibfk_1` FOREIGN KEY (`MAXE`) REFERENCES `xebuyt` (`MAXE`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `xebuyt`
--
ALTER TABLE `xebuyt`
  ADD CONSTRAINT `xebuyt_ibfk_1` FOREIGN KEY (`MATX`) REFERENCES `taixe` (`MATX`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
