-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 29, 2023 at 04:20 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `udatumm`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `all_patients_of_one_doctor` (IN `d_id1` INT)  BEGIN
SELECT p.* from users p JOIN patient_doctor pd on pd.p_id = p.id WHERE pd.d_id = d_id1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_latest_patient` ()  SELECT MAX(id) as newpatient FROM users WHERE users.type = 'patient'$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user` (IN `user_id1` INT)  BEGIN
SELECT * from users WHERE id = user_id1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_with_email` (IN `email1` VARCHAR(150))  BEGIN
SELECT * from users WHERE email = email1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `set_contact_form` (IN `name2` VARCHAR(30), IN `email2` VARCHAR(50), IN `msg2` TEXT)  BEGIN 
INSERT INTO contact_queries (name1, email1, msg1) VALUES(name2, email2, msg2);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `set_doctor_registration` (IN `name1` VARCHAR(150), IN `email1` VARCHAR(150), IN `pass1` VARCHAR(150))  INSERT INTO `users`(`name`, `email`, `password`, `type`, status1, verified1) VALUES (name1, email1, pass1, 'doctor', 0, 0)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `set_message` (IN `from1` INT, IN `to1` INT, IN `msg1` TEXT)  BEGIN
INSERT INTO msgs (from2, to2, msg) VALUES (from1, to1, msg1);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `set_patient_details` (IN `p_id1` INT, IN `birthdate1` VARCHAR(20), IN `high_treshold1` VARCHAR(100), IN `low_threshold1` VARCHAR(100), IN `medical_condition1` TEXT)  INSERT INTO `patient_details`(`p_id`, `birthdate`, `high_threshold`, `low_threshold`, `medical_condition`) VALUES (p_id1, birthdate1, high_treshold1, low_threshold1, medical_condition1)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `set_patient_devices` (IN `p_id1` INT, IN `device_barcode1` TEXT)  BEGIN
INSERT INTO patient_devices (device_barcode, p_id) VALUES (device_barcode1, p_id1);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `set_patient_notes` (IN `notes1` TEXT, IN `p_id1` INT)  BEGIN
INSERT INTO patient_notes (notes, p_id) VALUES (notes1, p_id1);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `set_patient_registration` (IN `name1` VARCHAR(100), IN `email1` VARCHAR(100), IN `pass1` VARCHAR(100))  INSERT INTO users(`name`, `email`, `password`, `type`, status1, verified1) VALUES (name1, email1, pass1, 'patient',0,0)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_name` (IN `new_name1` VARCHAR(30), IN `user_id1` INT)  BEGIN
UPDATE users SET name = new_name1 WHERE id = user_id1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `update_passworda` (IN `new_pass1` VARCHAR(100), IN `user_id1` INT)  BEGIN
UPDATE users SET password = new_pass1 WHERE id = user_id1;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `name1` varchar(100) NOT NULL,
  `email1` varchar(100) NOT NULL,
  `pass1` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `name1`, `email1`, `pass1`) VALUES
(1, 'test', 'test@test.com', '123456');

-- --------------------------------------------------------

--
-- Table structure for table `chatroom`
--

CREATE TABLE `chatroom` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chatroom`
--

INSERT INTO `chatroom` (`id`, `name`, `created_at`, `created_by`) VALUES
(1, 'chatroomname', '2023-03-12 11:12:52', 0),
(2, 'chatroomname', '2023-03-12 11:16:36', 0),
(3, 'asdfasdf', '2023-03-12 11:37:42', 100),
(4, 'asdfasdf', '2023-03-12 11:38:01', 100),
(5, 'asdfasdf', '2023-03-12 11:38:39', 100),
(6, 'asdfasdf', '2023-03-12 11:44:08', 100),
(7, 'asdfasdf', '2023-03-12 11:44:13', 102),
(8, 'asdfasdf', '2023-03-12 11:44:17', 103),
(9, 'asdfasdf', '2023-03-12 11:44:21', 117),
(10, 'asdfasdf', '2023-03-12 11:44:24', 256),
(11, 'asdfasdf', '2023-03-12 11:53:51', 100),
(12, 'asdfasdf', '2023-03-12 11:54:10', 100),
(13, 'asdfasdf', '2023-03-12 11:54:43', 100),
(14, 'asdfasdf', '2023-03-12 11:54:55', 102),
(15, 'asdfasdf', '2023-03-12 11:55:03', 102),
(16, 'asdfasdf', '2023-03-12 11:56:05', 102),
(17, 'asdfasdf', '2023-03-12 11:56:46', 102),
(18, 'asdfasdf', '2023-03-12 11:57:32', 102),
(19, 'asdfasdf', '2023-03-12 11:57:39', 102),
(20, 'asdfasdf', '2023-03-12 11:57:55', 102),
(21, 'asdfasdf', '2023-03-12 11:58:26', 102),
(22, 'asdfasdf', '2023-03-12 11:58:32', 100),
(23, 'asdfasdf', '2023-03-12 11:58:48', 256),
(24, 'asdfasdf', '2023-03-12 11:59:02', 256),
(25, 'asdfasdf', '2023-03-12 11:59:34', 256),
(26, 'asdfasdf', '2023-03-12 11:59:45', 256),
(27, 'asdfasdf', '2023-03-12 12:00:25', 256),
(28, 'asdfasdf', '2023-03-14 06:49:28', 256),
(29, 'asdfasdf', '2023-03-14 06:51:39', 256),
(30, 'asdfasdf', '2023-03-14 06:51:49', 256),
(31, 'asdfasdf', '2023-03-14 06:54:43', 256),
(32, 'asdfasdf', '2023-03-14 06:55:21', 256),
(33, 'kaho na pyaar hai', '2023-03-14 06:57:52', 256),
(34, 'lknaskldnf', '2023-03-14 07:09:51', 256),
(35, 'asif', '2023-03-14 07:09:57', 256),
(36, 'patient 1', '2023-03-15 15:27:59', 256),
(37, 'l;ml;dsmf;lasdf', '2023-03-15 15:31:50', 256),
(38, 'knslkdfn', '2023-03-15 15:32:26', 256),
(39, 'tahir', '2023-03-22 19:31:47', 256),
(40, 'test', '2023-03-24 11:58:45', 256),
(41, 'lknsdf', '2023-03-24 11:59:01', 256),
(42, 'nlksadnf', '2023-03-24 11:59:12', 256),
(43, 'chat with test', '2023-03-25 01:56:49', 256),
(44, 'chat with test1', '2023-03-25 01:57:28', 256);

-- --------------------------------------------------------

--
-- Table structure for table `chatroommembers`
--

CREATE TABLE `chatroommembers` (
  `id` int(11) NOT NULL,
  `chatroomID` int(11) NOT NULL,
  `memberID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chatroommembers`
--

INSERT INTO `chatroommembers` (`id`, `chatroomID`, `memberID`) VALUES
(5, 33, 256),
(6, 33, 100),
(7, 33, 102),
(8, 33, 103),
(9, 33, 117),
(10, 33, 118),
(11, 34, 256),
(12, 34, 100),
(13, 34, 102),
(14, 35, 256),
(15, 35, 100),
(16, 36, 256),
(17, 36, 100),
(18, 37, 256),
(19, 37, 100),
(20, 37, 102),
(21, 37, 103),
(22, 37, 117),
(23, 37, 118),
(24, 37, 120),
(25, 37, 121),
(26, 38, 256),
(27, 38, 100),
(28, 39, 256),
(29, 39, 103),
(30, 39, 117),
(31, 39, 118),
(32, 40, 256),
(33, 40, 124),
(34, 41, 256),
(35, 41, 124),
(36, 42, 256),
(37, 42, 100),
(38, 42, 124),
(39, 43, 256),
(40, 43, 124),
(41, 43, 126),
(42, 44, 256),
(43, 44, 126);

-- --------------------------------------------------------

--
-- Table structure for table `chatroommembers_archive`
--

CREATE TABLE `chatroommembers_archive` (
  `id` int(11) NOT NULL,
  `chatroomID` int(11) NOT NULL,
  `memberID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `chatroom_archive`
--

CREATE TABLE `chatroom_archive` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `contact_queries`
--

CREATE TABLE `contact_queries` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `patient_id`, `user_id`, `created_at`) VALUES
(2, 90, 248, '2023-02-24 07:33:50');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `chatroomid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `message`, `timestamp`, `chatroomid`) VALUES
(124, 95, 'Hi Doctr ! are you available tomorrow', '2023-02-11 21:05:51', 33),
(125, 95, 'Hi Doctr ! are you available today @ 5:00 pm', '2023-02-11 21:06:43', 33),
(126, 95, 'hello Doctor.i have some issues regarding my health. will you plz help me in this regard', '2023-02-11 21:06:44', 33),
(127, 95, 'hi hloo', '2023-02-11 21:06:45', 34),
(128, 95, 'hi hloo', '2023-02-11 21:06:47', 34),
(129, 95, 'hi hloo', '2023-02-11 21:06:48', 34),
(143, 248, 'hi hloo', '2023-02-22 14:49:26', 0),
(144, 248, 'hi hloo', '2023-02-22 15:08:49', 0),
(145, 248, 'hi hloo', '2023-02-22 22:53:40', 0),
(146, 248, 'hi hloo', '2023-02-22 23:04:18', 0),
(147, 248, 'hi hloo', '2023-02-22 23:05:46', 0),
(153, 248, 'hi hloo', '2023-02-23 18:40:19', 0),
(154, 248, 'hi hloo', '2023-02-23 18:42:23', 0),
(155, 248, 'hi hloo', '2023-02-23 18:44:16', 0),
(156, 248, 'hi hloo', '2023-02-23 18:46:07', 0),
(157, 248, 'hi hloo', '2023-02-23 19:24:58', 0),
(158, 248, 'hi hloo', '2023-02-24 12:33:50', 0),
(159, 248, 'hi hloo', '2023-02-24 12:39:42', 0),
(160, 248, 'hi hloo', '2023-02-24 12:39:52', 0),
(161, 248, 'hi hloo', '2023-02-24 12:40:13', 0),
(162, 248, 'hi hloo', '2023-02-24 13:22:48', 0),
(163, 248, 'hi hloo', '2023-02-24 13:23:44', 0),
(164, 248, 'hi hloo', '2023-02-24 13:24:19', 0),
(165, 248, 'hi hloo', '2023-02-24 13:26:03', 0),
(166, 248, 'hi hloo', '2023-02-24 13:27:02', 0),
(167, 248, 'hi hloo', '2023-02-24 13:27:56', 0),
(168, 248, 'hi hloo', '2023-02-24 13:29:02', 0),
(169, 248, 'hi hloo', '2023-02-24 13:30:48', 0),
(170, 248, 'hi hloo', '2023-02-24 13:32:25', 0),
(171, 248, 'hi hloo', '2023-02-24 13:33:48', 0),
(172, 248, 'hi hloo', '2023-02-24 13:34:08', 0),
(173, 248, 'hi hloo', '2023-02-24 13:42:12', 0),
(174, 90, 'hi hloo', '2023-02-24 13:42:34', 0),
(175, 256, 'hi hloo', '2023-02-24 13:23:44', 0),
(176, 256, 'ldfmlaskdflaksdf', '2023-02-24 13:24:19', 35),
(177, 256, 'hi hloolkmalksdflkasdnf', '2023-02-24 13:26:03', 35),
(178, 256, 'oiasndflksa', '2023-02-24 13:27:02', 35),
(179, 256, 'asif ahmed ali', '2023-03-14 17:47:35', 33),
(180, 256, 'asdfasdf', '2023-03-14 17:48:45', 33),
(181, 256, 'asdfasdf', '2023-03-14 17:48:58', 34),
(182, 256, 'asdfasdfasdf', '2023-03-14 17:49:25', 33),
(183, 256, '', '2023-03-14 17:50:22', 33),
(184, 256, '', '2023-03-14 17:50:56', 33),
(185, 256, 'asdfasdf', '2023-03-14 17:51:12', 33),
(186, 256, 'asdfasdfasdf', '2023-03-14 17:51:45', 33),
(187, 256, 'asdfasdfasdf', '2023-03-14 21:49:04', 33),
(188, 256, 'asif', '2023-03-14 22:23:02', 33),
(189, 256, 'asif', '2023-03-14 22:23:22', 33),
(190, 256, 'asif ahmed ali', '2023-03-14 22:26:43', 33),
(191, 256, 'asif ahmed ali', '2023-03-14 22:28:15', 33),
(192, 256, 'asif ahmed ali', '2023-03-14 22:29:45', 33),
(193, 256, 'asif ahmed ali', '2023-03-14 22:31:48', 33),
(194, 256, 'asif ahmed ali', '2023-03-14 22:32:25', 33),
(195, 256, 'asif ahmed ali', '2023-03-14 22:32:48', 33),
(196, 256, 'asif ahmed ali', '2023-03-14 22:33:07', 33),
(197, 256, 'sdfasdf', '2023-03-14 22:33:24', 33),
(198, 256, 'asdfasdf', '2023-03-14 22:34:27', 33),
(199, 256, 'asdfasdf', '2023-03-14 22:35:42', 33),
(200, 256, 'asdfasdfasdf', '2023-03-14 22:36:25', 33),
(201, 256, 'asasdfasdfasdf', '2023-03-14 22:37:01', 33),
(202, 256, 'asif ahmed ali', '2023-03-14 23:17:38', 33),
(203, 256, 'sohniye', '2023-03-14 23:17:54', 33),
(204, 256, 'asif ahmed al', '2023-03-14 23:31:02', 33),
(205, 256, 'asif askdf', '2023-03-14 23:32:22', 33),
(206, 256, 'asif ahmed ali\r\n', '2023-03-14 23:44:52', 33),
(207, 256, 'jutt\r\njames\r\nbond\r\naao g', '2023-03-14 23:45:17', 33),
(208, 256, 'kkkkkkkalsdnflaksndflkasndflknaslkdfnlaksnd aslkdfnalskdnf alskdnf alsdknfl asdfklsa dflkjsdlkfja sdlkfj alskjdflkaj sdlfkj asldkjf alskjdflkasjdf aslkdf aslkjdflskdfjkasbdfkjsabdkjfasdf', '2023-03-14 23:45:55', 33),
(209, 256, 'aslkdnfaslkdnf aslkdfnalksdnfkla sdklnflkasdnflk ansdlkfnaslkdfnlkasn df', '2023-03-15 20:29:04', 36),
(210, 256, 'kansdflkasn lkasfdnlaksdf', '2023-03-15 20:32:00', 37),
(211, 256, 'klnaskldfasdf', '2023-03-21 12:45:40', 33),
(212, 256, 'asdnflkasndlfasdf', '2023-03-21 12:50:41', 33),
(213, 256, 'laskndflkasnf', '2023-03-21 12:51:07', 33),
(214, 256, 'asdfasdf', '2023-03-21 12:51:50', 33),
(215, 256, 'sdf', '2023-03-21 12:51:59', 33),
(216, 256, 'sdf', '2023-03-21 12:52:22', 33),
(217, 256, 'asdfsadf', '2023-03-21 12:53:35', 33),
(218, 256, 'asdfasdfasdf', '2023-03-21 12:54:17', 33),
(219, 256, 'asdfasdf', '2023-03-21 12:54:56', 33),
(220, 256, 'asdfasdfasdf', '2023-03-21 12:55:17', 33),
(221, 256, 'asdfasdf', '2023-03-21 12:55:30', 33),
(222, 256, 'asdfasdfasdf', '2023-03-21 12:57:53', 33),
(223, 256, 'asdfasdf', '2023-03-21 12:58:24', 33),
(224, 256, 'asdfasdfdfdf', '2023-03-21 12:58:27', 33),
(225, 256, 'lkasndflkansldkf', '2023-03-21 13:01:40', 33),
(226, 256, 'lkasndflkansldkfasdfasdf', '2023-03-21 13:01:46', 33),
(227, 256, 'lkasndflkansldkfasdfasdfasdfasdf', '2023-03-21 13:01:49', 33),
(228, 256, 'lml;m;lasmdf', '2023-03-21 13:02:09', 33),
(229, 256, 'lml;m;lasmdfllskdnflkasndf', '2023-03-21 13:02:13', 33),
(230, 256, 'lml;m;lasmdfllskdnflkasndfsdf', '2023-03-21 13:02:43', 33),
(231, 256, 'lm;lsdmf;sdf', '2023-03-21 13:03:46', 33),
(232, 256, 'lm;lsdmf;sdf1', '2023-03-21 13:03:49', 33),
(233, 256, 'lm;lsdmf;sdf1121', '2023-03-21 13:03:51', 33),
(234, 256, 'asdfasdf', '2023-03-21 13:09:17', 34),
(235, 256, 'suna bachya', '2023-03-23 00:32:03', 39),
(236, 256, 'aisf', '2023-03-24 16:59:57', 40),
(237, 124, 'suna doctra\r\n', '2023-03-24 17:00:52', 40),
(238, 256, 'me thk \r\ntu suna\r\nchass le rya ain?', '2023-03-24 17:01:18', 40),
(239, 124, 'chass e chass k', '2023-03-24 17:01:32', 40),
(240, 256, 'hi mundya\r\n', '2023-03-24 17:25:38', 42),
(241, 256, 'tn beemar ain\r\nrest kr', '2023-03-24 17:25:45', 42),
(242, 124, 'lknaskdlfasdf', '2023-03-24 17:27:14', 40),
(243, 124, 'lknaslkdfasdf', '2023-03-24 17:27:31', 40),
(244, 256, 'as ndlkfnasdf', '2023-03-24 17:27:39', 33),
(245, 256, 'klnaslkdf', '2023-03-24 17:27:58', 33),
(246, 124, 'asdfasdf', '2023-03-24 17:28:45', 40),
(247, 124, 'bachya\r\nbeemar ain\r\nrest kr', '2023-03-24 17:29:24', 40),
(248, 124, 'nlkn', '2023-03-24 17:29:33', 40),
(249, 124, 'bachya\r\nrest kr', '2023-03-24 17:30:01', 40),
(250, 124, 'nlknlkansdlf', '2023-03-24 17:30:11', 40),
(251, 124, 'knsadlkf as\r\nasdklfnasdf\r\nadsjkfbaksdf\r\nasjdfbkadf\r\nsadkjfbaksdf\r\nadksjfbakjdf\r\nasfkjdkajsdf', '2023-03-24 17:30:26', 40),
(252, 124, 'alksndfklasndf\r\naskldfnlasdf\r\naskdfnlaksdf\r\nadslkfnalskdf', '2023-03-24 17:30:45', 40),
(253, 256, 'kasndfklansdf\r\nasldknfalksdf\r\naskldnflkasdf\r\nasjkdfnbkasdnf\r\nasdkfnaksldf\r\nasdkfnalskdf', '2023-03-24 17:31:56', 33),
(254, 124, 'alskdnflkasndf\r\nasldkfnalksdf\r\naskjdfkjasdbf\r\naskdjfbkajsdf\r\naskjdfbakdf\r\nasdkjfbakjsdf\r\naskjdfbkajsd\r\nasdjfbkasjdf\r\naskjdbfkajsdf', '2023-03-24 17:32:35', 40),
(255, 256, 'han pta hy\r\nbaap ko mat sikhaa\r\n', '2023-03-24 17:32:52', 40),
(256, 256, 'lknaslkdfnaskldf', '2023-03-25 06:56:55', 43),
(257, 256, 'asldknflaksndfl', '2023-03-25 06:57:33', 44),
(258, 126, 'lkasndflkasdf alskndflaskdf', '2023-03-25 06:57:51', 44),
(259, 256, 'nklasndf', '2023-04-25 23:29:48', 33),
(260, 256, 'asdkfn', '2023-04-25 23:29:54', 33);

-- --------------------------------------------------------

--
-- Table structure for table `messages_archive`
--

CREATE TABLE `messages_archive` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp(),
  `chatroomid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `message_attachments`
--

CREATE TABLE `message_attachments` (
  `id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `message_attachments`
--

INSERT INTO `message_attachments` (`id`, `message_id`, `file_name`, `file_path`, `created_at`) VALUES
(36, 173, 'img8-removebg-preview.png', '\\attachments-1677228132117.png', '2023-02-24 13:42:12'),
(37, 174, 'img8-removebg-preview.png', '\\attachments-1677228154658.png', '2023-02-24 13:42:34'),
(75, 200, '1678815385132Screenshot2023-03-07at12.13.49AM.png', 'uploads/1678815385132Screenshot2023-03-07at12.13.49AM.png', '2023-03-14 22:36:25'),
(76, 200, '1678815385132Screenshot2023-03-08at3.18.14PM.png', 'uploads/1678815385132Screenshot2023-03-08at3.18.14PM.png', '2023-03-14 22:36:25'),
(77, 200, '1678815385132Screenshot2023-03-10at8.12.16PM.png', 'uploads/1678815385132Screenshot2023-03-10at8.12.16PM.png', '2023-03-14 22:36:25'),
(78, 200, '1678815385132Screenshot2023-03-08at12.43.02PM.png', 'uploads/1678815385132Screenshot2023-03-08at12.43.02PM.png', '2023-03-14 22:36:25'),
(79, 201, '1678815421111Screenshot2023-03-07at12.13.49AM.png', 'uploads/1678815421111Screenshot2023-03-07at12.13.49AM.png', '2023-03-14 22:37:01'),
(80, 201, '1678815421111Screenshot2023-03-08at3.18.14PM.png', 'uploads/1678815421111Screenshot2023-03-08at3.18.14PM.png', '2023-03-14 22:37:01'),
(81, 201, '1678815421111Screenshot2023-03-08at12.43.02PM.png', 'uploads/1678815421111Screenshot2023-03-08at12.43.02PM.png', '2023-03-14 22:37:01'),
(82, 201, '1678815421111Screenshot2023-03-10at8.12.16PM.png', 'uploads/1678815421111Screenshot2023-03-10at8.12.16PM.png', '2023-03-14 22:37:01'),
(83, 209, 'Screenshot2023-03-08at3.18.14PM.png', 'uploads/Screenshot2023-03-08at3.18.14PM.png', '2023-03-15 20:29:04'),
(84, 209, 'Screenshot2023-03-07at12.13.49AM.png', 'uploads/Screenshot2023-03-07at12.13.49AM.png', '2023-03-15 20:29:04'),
(85, 209, 'Screenshot2023-03-08at12.43.02PM.png', 'uploads/Screenshot2023-03-08at12.43.02PM.png', '2023-03-15 20:29:04'),
(86, 209, 'Screenshot2023-03-10at8.12.16PM.png', 'uploads/Screenshot2023-03-10at8.12.16PM.png', '2023-03-15 20:29:04'),
(87, 225, 'Screenshot2023-03-02at8.17.21PM.png', 'uploads/Screenshot2023-03-02at8.17.21PM.png', '2023-03-21 13:01:40'),
(88, 225, 'Screenshot2023-03-02at8.18.36PM.png', 'uploads/Screenshot2023-03-02at8.18.36PM.png', '2023-03-21 13:01:40'),
(89, 225, 'Screenshot2023-03-02at12.07.32AM.png', 'uploads/Screenshot2023-03-02at12.07.32AM.png', '2023-03-21 13:01:40'),
(90, 225, 'Screenshot2023-03-03at12.02.37PM.png', 'uploads/Screenshot2023-03-03at12.02.37PM.png', '2023-03-21 13:01:40'),
(91, 225, 'Screenshot2023-03-03at12.02.22PM.png', 'uploads/Screenshot2023-03-03at12.02.22PM.png', '2023-03-21 13:01:40'),
(92, 226, '1679385706018Screenshot2023-03-02at12.07.32AM.png', 'uploads/1679385706018Screenshot2023-03-02at12.07.32AM.png', '2023-03-21 13:01:46'),
(93, 226, '1679385706018Screenshot2023-03-02at8.17.21PM.png', 'uploads/1679385706018Screenshot2023-03-02at8.17.21PM.png', '2023-03-21 13:01:46'),
(94, 226, '1679385706018Screenshot2023-03-02at8.18.36PM.png', 'uploads/1679385706018Screenshot2023-03-02at8.18.36PM.png', '2023-03-21 13:01:46'),
(95, 226, '1679385706018Screenshot2023-03-03at12.02.22PM.png', 'uploads/1679385706018Screenshot2023-03-03at12.02.22PM.png', '2023-03-21 13:01:46'),
(96, 226, 'Screenshot2023-03-03at12.02.37PM.png', 'uploads/Screenshot2023-03-03at12.02.37PM.png', '2023-03-21 13:01:46'),
(97, 227, '1679385709961Screenshot2023-03-02at8.17.21PM.png', 'uploads/1679385709961Screenshot2023-03-02at8.17.21PM.png', '2023-03-21 13:01:49'),
(98, 227, '1679385709961Screenshot2023-03-02at8.18.36PM.png', 'uploads/1679385709961Screenshot2023-03-02at8.18.36PM.png', '2023-03-21 13:01:49'),
(99, 227, '1679385709962Screenshot2023-03-03at12.02.22PM.png', 'uploads/1679385709962Screenshot2023-03-03at12.02.22PM.png', '2023-03-21 13:01:49'),
(100, 227, '1679385709962Screenshot2023-03-02at12.07.32AM.png', 'uploads/1679385709962Screenshot2023-03-02at12.07.32AM.png', '2023-03-21 13:01:49'),
(101, 227, 'Screenshot2023-03-03at12.02.37PM.png', 'uploads/Screenshot2023-03-03at12.02.37PM.png', '2023-03-21 13:01:49');

-- --------------------------------------------------------

--
-- Table structure for table `message_attachments_archive`
--

CREATE TABLE `message_attachments_archive` (
  `id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `message_emojis`
--

CREATE TABLE `message_emojis` (
  `id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `emoji` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `doctor_id` int(11) NOT NULL,
  `doctor_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `name`, `email`, `password`, `created_at`, `doctor_id`, `doctor_name`) VALUES
(90, 'ali', 'ali@test.com', '123456789', '2023-02-04 19:24:40', 239, 'Dr Waqas'),
(92, 'Aleeee', 'ali2@test.com', '123456789', '2023-02-04 23:20:10', 239, 'Dr Waqas'),
(93, 'Aleeee', 'ali3@test.com', '123456789', '2023-02-05 00:08:23', 242, 'Zeeshan Ahmed'),
(94, 'arslan', 'arslan@test.com', '123456789', '2023-02-09 00:21:07', 90, 'ali'),
(95, 'maana', 'maana@test.com', '123456789', '2023-02-09 00:22:53', 242, 'Zeeshan Ahmed Gujjar'),
(96, 'salman', 'salman@test.com', '123456789', '2023-02-13 22:15:38', 247, 'zeeshan'),
(97, 'salman', 'salman1@test.com', '123456789', '2023-02-13 22:16:38', 247, 'zeeshan'),
(99, 'zeeshan', 'webdev335@gmail.com', '123456789', '2023-02-13 22:21:29', 247, 'zeeshan'),
(100, 'asdfasdf1212', 'asif@mexil.it.com', '123456', '2023-03-04 12:00:49', 256, 'Asif Ahmed Ali'),
(126, 'Ali', 'mik268@nyu.edu', 'test', '2023-03-25 06:52:58', 256, 'usama'),
(130, 'test', 'aali.msit22seecs@seecs.edu.pk1.as', 'test', '2023-03-31 02:18:42', 259, 'miz'),
(131, 'test', 'aali.msit22seecs@seecs.edu.pk', 'test', '2023-04-02 00:45:20', 260, 'Moiz'),
(132, 'test', 'aali.msit22seecs@seecs.edu.pk.com', 'test', '2023-04-02 00:48:16', 260, 'Moiz'),
(133, 'test', 'aali.msit22seecs@seecs.edu', 'test', '2023-04-02 00:48:27', 260, 'Moiz'),
(136, 'test1', 'aali.msit22seecs@seecs.com', 'test', '2023-04-06 01:45:07', 260, 'Moiz'),
(137, 'test', 'aali.msit22seecs@seecs.edu.pk.ai', 'test', '2023-04-06 02:32:18', 260, 'Moiz');

-- --------------------------------------------------------

--
-- Table structure for table `patients_archive`
--

CREATE TABLE `patients_archive` (
  `idfrompatientstable` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `doctor_id` int(11) NOT NULL,
  `doctor_name` varchar(255) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patients_archive`
--

INSERT INTO `patients_archive` (`idfrompatientstable`, `name`, `email`, `password`, `created_at`, `doctor_id`, `doctor_name`, `id`) VALUES
(102, 'moiz', 'mik268@nyu.edu.com', '123456789', '2023-03-04 12:15:10', 256, 'Asif Ahmed Ali', 1),
(102, 'moiz', 'mik268@nyu.edu.com', '123456789', '2023-03-04 12:15:10', 256, 'Asif Ahmed Ali', 2),
(103, 'moiz', 'mik268@nyu1.edu.com', '123456789', '2023-03-04 12:18:08', 256, 'Asif Ahmed Ali', 3),
(117, 'test', 'aali.msit22seecs@seecs.edu.pk', 'test', '2023-03-05 13:31:31', 256, 'Asif Ahmed Ali', 4),
(118, 'ali', 'careers@mexil.it', '123456', '2023-03-05 21:57:15', 256, 'Asif Ahmed Ali', 5),
(120, 'test', 'khurramshahzada@gmail.com', 'test', '2023-03-14 12:18:54', 256, 'Asif Ahmed Ali', 6),
(121, 'test', 'kshahzad.msit22seecs@seecs.edu.pk', 'test', '2023-03-14 12:19:41', 256, 'Asif Ahmed Ali', 7);

-- --------------------------------------------------------

--
-- Table structure for table `patient_details`
--

CREATE TABLE `patient_details` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `date_of_birth` date NOT NULL,
  `high_threshold` float DEFAULT NULL,
  `low_threshold` float DEFAULT NULL,
  `medical_condition` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient_details`
--

INSERT INTO `patient_details` (`id`, `patient_id`, `date_of_birth`, `high_threshold`, `low_threshold`, `medical_condition`) VALUES
(3, 90, '1993-05-07', 257, 11, 'BP High'),
(5, 92, '1993-05-07', 146.5, 500.656, 'BP High with blood sugar'),
(6, 93, '1993-05-07', 146.5, 500.656, 'BP High with blood sugar'),
(7, 95, '1993-05-07', 256.5, 10.656, 'BP High'),
(8, 96, '1993-05-07', 256.5, 10.656, 'BP High'),
(9, 97, '1993-05-07', 256.5, 10.656, 'BP High'),
(11, 99, '1993-05-07', 256.5, 10.656, 'BP High'),
(12, 100, '2023-03-30', 2323, 101, 'asdfasdfasdf'),
(110, 126, '2023-03-29', 1212, 1212, 'asdfasdf'),
(111, 130, '2023-03-29', 1212, 1212, 'asdfasdf'),
(112, 131, '2023-04-27', 1212, 1212, 'asdfasdf'),
(113, 132, '2023-04-18', 1212, 1212, 'asdfasdf'),
(114, 133, '2023-03-28', 1212, 1212, 'asdfasdf'),
(115, 136, '2023-04-27', 1212, 1212, 'asdfasdf'),
(116, 137, '2023-05-04', 1212, 1212, 'asdfasdf');

-- --------------------------------------------------------

--
-- Table structure for table `patient_devices`
--

CREATE TABLE `patient_devices` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `device_barcode` varchar(255) DEFAULT NULL,
  `device_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient_devices`
--

INSERT INTO `patient_devices` (`id`, `patient_id`, `device_barcode`, `device_name`) VALUES
(72, 90, '111-111-111', ''),
(74, 92, '111-111-333', ''),
(75, 93, '111-111-333', ''),
(76, 94, '111-111-111', ''),
(77, 95, '111-111-111', ''),
(78, 96, '111-111-111', ''),
(79, 97, '111-111-111', ''),
(81, 99, '111-111-111', ''),
(82, 100, '111-111-111', 'deaaskjf'),
(113, 100, '111-111-111asdf', 'deaaskjfaasdf'),
(114, 100, '111-111-111asdfaas', 'deaaskjfasdfasd'),
(115, 100, '111-111-111asdfasdf', 'deaaskjfaasdfasdf'),
(117, 126, 'barcode', 'stethoscope'),
(118, 130, 'barcode', 'stethoscope'),
(119, 131, 'barcode', 'stethoscope'),
(120, 132, 'barcode1', 'stethoscope'),
(121, 133, 'barcode2', 'stethoscope'),
(122, 136, 'barcode', 'stethoscope'),
(123, 137, 'barcode', 'Weight');

-- --------------------------------------------------------

--
-- Table structure for table `patient_devices_archive`
--

CREATE TABLE `patient_devices_archive` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `device_barcode` varchar(255) DEFAULT NULL,
  `device_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `patient_doctor`
--

CREATE TABLE `patient_doctor` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `doctor_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient_doctor`
--

INSERT INTO `patient_doctor` (`id`, `patient_id`, `doctor_id`, `doctor_name`) VALUES
(48, 90, 239, 'Dr Waqas'),
(50, 92, 239, 'Dr Waqas'),
(51, 93, 242, 'Zeeshan Ahmed'),
(53, 95, 242, 'Zeeshan Ahmed Gujjar'),
(54, 96, 247, 'zeeshan'),
(55, 97, 247, 'zeeshan'),
(57, 99, 247, 'zeeshan'),
(58, 100, 256, 'Asif Ahmed Ali'),
(71, 126, 256, 'usama'),
(72, 130, 259, 'miz'),
(73, 131, 260, 'Moiz'),
(74, 132, 260, 'Moiz'),
(75, 133, 260, 'Moiz'),
(76, 136, 260, 'Moiz'),
(77, 137, 260, 'Moiz');

-- --------------------------------------------------------

--
-- Table structure for table `patient_doctor_archive`
--

CREATE TABLE `patient_doctor_archive` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `doctor_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `patient_notes`
--

CREATE TABLE `patient_notes` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient_notes`
--

INSERT INTO `patient_notes` (`id`, `patient_id`, `note`, `created_at`) VALUES
(64, 90, 'need more attention on patient for fast recovery', '2023-03-05 13:18:55'),
(66, 92, 'need more attention on patient for fast recovery', '2023-03-05 13:18:55'),
(67, 93, 'need more attention on patient for fast recovery', '2023-03-05 13:18:55'),
(68, 94, 'need more attention on patient for fast recovery', '2023-03-05 13:18:55'),
(69, 95, 'need more attention on patient for fast recovery', '2023-03-05 13:18:55'),
(70, 96, 'need more attention on patient for fast recovery', '2023-03-05 13:18:55'),
(71, 97, 'need more attention on patient for fast recovery', '2023-03-05 13:18:55'),
(73, 100, 'need more attention on patient for fast recovery', '2023-03-05 13:18:55'),
(94, 100, 'asdfasdf', '2023-03-22 19:01:58'),
(95, 100, 'asdfasdfasdf', '2023-03-22 19:09:02'),
(97, 126, 'asdfasdfasdfasdf', '2023-03-25 01:52:58'),
(98, 126, 'knlknsdlkfn aslkdfnaksld nf', '2023-03-25 02:01:04'),
(99, 130, 'asdfasdfasdfasdf', '2023-03-30 21:18:42'),
(100, 131, 'asdfasdfasdfasdf', '2023-04-01 19:45:20'),
(101, 132, 'asdfasdfasdfasdf', '2023-04-01 19:48:16'),
(102, 133, 'asdfasdfasdfasdf', '2023-04-01 19:48:27'),
(103, 136, 'asdfasdfasdfasdf', '2023-04-05 20:45:07'),
(104, 137, 'asdfasdfasdfasdf', '2023-04-05 21:32:18');

-- --------------------------------------------------------

--
-- Table structure for table `patient_notes_archive`
--

CREATE TABLE `patient_notes_archive` (
  `id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `patient_time`
--

CREATE TABLE `patient_time` (
  `id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `time_spent` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient_time`
--

INSERT INTO `patient_time` (`id`, `doctor_id`, `patient_id`, `time_spent`) VALUES
(1, 256, 100, '175'),
(2, 256, 12, '0'),
(3, 256, 101, '0'),
(4, 256, 102, '0'),
(5, 256, 103, '10'),
(6, 256, 117, '4'),
(7, 256, 126, '40'),
(8, 259, 130, '0'),
(9, 260, 131, '6'),
(10, 260, 132, '2'),
(11, 260, 133, '0'),
(12, 260, 136, '0');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `name` varchar(100) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(32) NOT NULL,
  `create_time` timestamp NULL DEFAULT current_timestamp(),
  `id` int(11) NOT NULL,
  `type` enum('doctor','admin') NOT NULL DEFAULT 'doctor',
  `status1` int(11) NOT NULL DEFAULT 0,
  `verified1` int(11) NOT NULL DEFAULT 0,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`name`, `email`, `password`, `create_time`, `id`, `type`, `status1`, `verified1`, `token`) VALUES
('Dr Waqas', 'waqas@gmail.com', '123456789', '2023-02-04 14:23:25', 239, 'doctor', 1, 1, '67fa2c54aedde9e8d0d60f23e7a30d35e41ffc33'),
('Dr Tahir Zaib', 'tahirzaib92@gmail.com', '123456789', '2023-02-04 18:34:49', 240, 'doctor', 1, 1, '0a108f0b1fabdaeff4ecbd3d9d0bc6b30dff6910'),
('Zeeshan Ahmed', 'webdev3356@gmail.com', '123456789', '2023-02-04 18:49:38', 243, 'doctor', 1, 1, 'd5c1ced5cf6d42a7249d5bdd67a0c931a2b08f3e'),
('Abdullah Khan', 'abdullah@gmail.com', '123456789', '2023-02-08 19:29:53', 244, 'doctor', 1, 1, '1c0c38a5f0c5dc114bedd16914cc42b94f316ba7'),
('zeeshan', 'webdev335@gmail.com', '123456789', '2023-02-14 10:32:08', 248, 'doctor', 1, 1, '855f22521ecb2c94c3406238651f42c120dfbc05'),
('ahsan ali', 'ahsan@test.com', '123456789', '2023-02-14 10:42:40', 250, 'doctor', 0, 0, 'a547cb51efdf7b53605d319e82d00806ccd60ee6'),
('usama alksdflkansd', 'asif@mexil.it', '123456', '2023-03-04 06:35:40', 256, 'doctor', 1, 1, NULL),
('Asif Ahmed Ali', 'aaali.bscs15seecs@seecs.edu.pk', '123456', '2023-03-05 16:53:00', 257, 'doctor', 1, 1, NULL),
('asif', 'asif@mexil.it.pk', '123456789', '2023-03-12 11:25:26', 258, 'doctor', 1, 0, '7d7df36ed7f11444ecd1cf26d224662c8ddc4d3e'),
('Moiz', 'mik268@nyu.edu', '123456', '2023-04-01 19:42:37', 260, 'doctor', 1, 1, 'b6228abf3e46067cf250d72dc3081abd99f62dae');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chatroom`
--
ALTER TABLE `chatroom`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chatroommembers`
--
ALTER TABLE `chatroommembers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_queries`
--
ALTER TABLE `contact_queries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD UNIQUE KEY `id` (`id`) USING BTREE;

--
-- Indexes for table `message_attachments`
--
ALTER TABLE `message_attachments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message_emojis`
--
ALTER TABLE `message_emojis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_id` (`message_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `patients_archive`
--
ALTER TABLE `patients_archive`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patient_details`
--
ALTER TABLE `patient_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_details_ibfk_1` (`patient_id`);

--
-- Indexes for table `patient_devices`
--
ALTER TABLE `patient_devices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_devices_ibfk_1` (`patient_id`);

--
-- Indexes for table `patient_doctor`
--
ALTER TABLE `patient_doctor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `patient_doctor_ibfk_1` (`patient_id`);

--
-- Indexes for table `patient_notes`
--
ALTER TABLE `patient_notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_notes_ibfk_1` (`patient_id`);

--
-- Indexes for table `patient_time`
--
ALTER TABLE `patient_time`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `chatroom`
--
ALTER TABLE `chatroom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `chatroommembers`
--
ALTER TABLE `chatroommembers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `contact_queries`
--
ALTER TABLE `contact_queries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=261;

--
-- AUTO_INCREMENT for table `message_attachments`
--
ALTER TABLE `message_attachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `message_emojis`
--
ALTER TABLE `message_emojis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=138;

--
-- AUTO_INCREMENT for table `patients_archive`
--
ALTER TABLE `patients_archive`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `patient_details`
--
ALTER TABLE `patient_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `patient_devices`
--
ALTER TABLE `patient_devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- AUTO_INCREMENT for table `patient_doctor`
--
ALTER TABLE `patient_doctor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT for table `patient_notes`
--
ALTER TABLE `patient_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `patient_time`
--
ALTER TABLE `patient_time`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=261;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `message_attachments`
--
ALTER TABLE `message_attachments`
  ADD CONSTRAINT `message_attachments_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `message_emojis`
--
ALTER TABLE `message_emojis`
  ADD CONSTRAINT `message_emojis_ibfk_1` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`);

--
-- Constraints for table `patient_details`
--
ALTER TABLE `patient_details`
  ADD CONSTRAINT `patient_details_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `patient_devices`
--
ALTER TABLE `patient_devices`
  ADD CONSTRAINT `patient_devices_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `patient_doctor`
--
ALTER TABLE `patient_doctor`
  ADD CONSTRAINT `patient_doctor_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `patient_doctor_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `patient_notes`
--
ALTER TABLE `patient_notes`
  ADD CONSTRAINT `patient_notes_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
