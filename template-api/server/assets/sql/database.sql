CREATE DATABASE  IF NOT EXISTS `budgetvision` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `budgetvision`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: budgetvision
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `start_time` datetime(6) NOT NULL,
  `extended_time` datetime(6) DEFAULT NULL,
  `expiry_time` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,'admin@gmail.com','2023-10-18 20:11:23.000000',NULL,'2023-10-18 20:41:23.000000');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `transaction_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `libelle` text COLLATE utf8mb4_unicode_ci,
  `amount` decimal(10,2) NOT NULL,
  `transaction_date` date NOT NULL,
  PRIMARY KEY (`transaction_id`),
  UNIQUE KEY `transaction_id` (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO transactions (user_id, category, libelle, amount, transaction_date) VALUES
    (2, 'Groceries', 'Grocery shopping', -50.00, '2023-08-01'),
    (2, 'Utilities', 'Electric bill', -75.00, '2022-09-05'),
    (2, 'Dining', 'Dinner with friends', -30.00, '2020-09-02'),
    (2, 'Travel', 'Trip to Paris', -500.00, '2023-09-06'),
    (2, 'Entertainment', 'Movie night', -15.00, '2023-09-07'),
    (2, 'Groceries', 'Weekly groceries', -60.00, '2023-09-08'),
    (2, 'Dining', 'Lunch at cafe', -20.00, '2023-09-09'),
    (2, 'Utilities', 'Water bill', -45.00, '2023-09-10'),
    (2, 'Travel', 'Train tickets', -80.00, '2023-09-11'),
    (2, 'Entertainment', 'Concert tickets', -100.00, '2023-09-12'),
    (2, 'Groceries', 'Fruits and veggies', -35.00, '2023-09-25'),
    (2, 'Utilities', 'Gas bill', -55.00, '2023-09-26'),
    (2, 'Dining', 'Sushi restaurant', -40.00, '2023-09-27'),
    (2, 'Travel', 'Flight to Tokyo', -700.00, '2023-09-28'),
    (2, 'Entertainment', 'Theater show', -70.00, '2023-09-29'),
    (2, 'Groceries', 'Meat purchase', -50.00, '2023-09-30'),
    (2, 'Utilities', 'Internet bill', -65.00, '2023-10-01'),
    (2, 'Dining', 'Pizza night', -25.00, '2023-10-02'),
    (2, 'Travel', 'Bus to countryside', -30.00, '2023-10-03'),
    (2, 'Entertainment', 'Amusement park', -95.00, '2023-10-04'),
    (2, 'Groceries', 'Grocery shopping', -50.00, '2023-09-01'),
    (2, 'Utilities', 'Electric bill', -75.00, '2023-09-05'),
    (2, 'Dining', 'Dinner with friends', -30.00, '2023-09-02'),
    (2, 'Travel', 'Trip to Paris', -500.00, '2023-09-06'),
    (2, 'Entertainment', 'Movie night', -15.00, '2023-09-07'),
    (2, 'Groceries', 'Weekly groceries', -60.00, '2023-09-08'),
    (2, 'Dining', 'Lunch at cafe', -20.00, '2023-09-09'),
    (2, 'Utilities', 'Water bill', -45.00, '2023-09-10'),
    (2, 'Travel', 'Train tickets', -80.00, '2023-09-11'),
    (2, 'Entertainment', 'Concert tickets', -100.00, '2023-09-12'),
    (2, 'Groceries', 'Fruits and veggies', -35.00, '2023-09-25'),
    (2, 'Utilities', 'Gas bill', -55.00, '2023-09-26'),
    (2, 'Dining', 'Sushi restaurant', -40.00, '2023-09-27'),
    (2, 'Travel', 'Flight to Tokyo', -700.00, '2023-09-28'),
    (2, 'Entertainment', 'Theater show', -70.00, '2023-09-29'),
    (2, 'Groceries', 'Meat purchase', -50.00, '2023-09-30'),
    (2, 'Utilities', 'Internet bill', -65.00, '2023-10-01'),
    (2, 'Dining', 'Pizza night', -25.00, '2023-10-02'),
    (2, 'Travel', 'Bus to countryside', -30.00, '2023-10-03'),
    (2, 'Entertainment', 'Amusement park', -95.00, '2023-10-04'),
    (2, 'Groceries', 'Grocery shopping', -50.00, '2023-09-01'),
    (2, 'Utilities', 'Electric bill', -75.00, '2023-09-05'),
    (2, 'Dining', 'Dinner with friends', -30.00, '2023-09-02'),
    (2, 'Travel', 'Trip to Paris', -500.00, '2023-09-06'),
    (2, 'Entertainment', 'Movie night', -15.00, '2023-09-07'),
    (2, 'Groceries', 'Weekly groceries', -60.00, '2023-09-08'),
    (2, 'Dining', 'Lunch at cafe', -20.00, '2023-09-09'),
    (2, 'Utilities', 'Water bill', -45.00, '2023-09-10'),
    (2, 'Travel', 'Train tickets', -80.00, '2023-09-11'),
    (2, 'Entertainment', 'Concert tickets', -100.00, '2023-09-12'),
    (2, 'Groceries', 'Fruits and veggies', -35.00, '2023-09-25'),
    (2, 'Utilities', 'Gas bill', -55.00, '2023-09-26'),
    (2, 'Dining', 'Sushi restaurant', -40.00, '2023-09-27'),
    (2, 'Travel', 'Flight to Tokyo', -700.00, '2023-09-28'),
    (2, 'Entertainment', 'Theater show', -70.00, '2023-09-29'),
    (2, 'Groceries', 'Meat purchase', -50.00, '2023-09-30'),
    (2, 'Utilities', 'Internet bill', -65.00, '2023-10-01'),
    (2, 'Dining', 'Pizza night', -25.00, '2023-10-02'),
    (2, 'Travel', 'Bus to countryside', -30.00, '2023-10-03'),
    (2, 'Entertainment', 'Amusement park', -95.00, '2023-10-04'),
    (2, 'Salary', 'SALARY', 3000, '2023-10-04'),
    (2, 'Groceries', 'Bakery products', -20.00, '2023-10-30');
    /*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_limit` int DEFAULT NULL,
  `balance` int DEFAULT NULL,
  `notification_preference` enum('email','sms','both','none') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Patrick','patrick@gmail.com','1234567890',30,'123456',1000,0,'email'),(2,'Admin','admin@gmail.com','0000000000',100,'admin',-3000,0,'sms');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-18 16:38:07
