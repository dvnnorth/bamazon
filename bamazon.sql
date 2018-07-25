-- MySQL dump 10.16  Distrib 10.1.34-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: bamazon
-- ------------------------------------------------------
-- Server version	10.1.34-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `bamazon`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `bamazon` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `bamazon`;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `department_id` int(100) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `over_head_costs` int(100) NOT NULL,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Electronics',20000),(2,'Appliances',15000),(3,'Garden',12000),(4,'Kitchen',18000),(5,'Home',21000),(6,'Music',9000),(7,'Movies',9000),(8,'Clothing',18000),(9,'Toys',15000),(10,'Grocery',17000);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `item_id` int(10) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int(5) NOT NULL,
  `product_sales` decimal(65,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Bialetti Moka Express','Kitchen',29.00,14,2900.00),(2,'Instant Pot','Kitchen',100.00,21,0.00),(3,'Playstation 4 Pro','Electronics',399.99,11,0.00),(4,'Wash-o-Matic Washing Machine','Appliances',599.00,5,0.00),(5,'Sony 50-XBR200 4KTV','Electronics',1199.99,2,1199.99),(6,'1500 Thread Count Microfiber Sheet Set','Home',89.99,10,0.00),(7,'LED Edison Bulb Lamp','Home',29.99,7,299.90),(8,'Begonia bulbs, 10-ct','Garden',10.99,8,0.00),(9,'Grass Annihilator 2000','Garden',499.99,4,49499.01),(10,'A Fridge, but with Google','Appliances',1099.99,3,111098.99),(11,'Glass Chandelier','Home',999.99,1,1999.98),(12,'Nintendo Switch','Electronics',299.99,14,1199.96),(13,'Klipsch Speakers','Electronics',199.99,4,1199.94),(14,'\"Hearts Beat Loud\" Original Soundtrack','Music',19.99,1,339.83),(15,'Xbox One X','Electronics',499.99,7,0.00),(16,'Pioneer VSX-31 THX Audio Receiver','Electronics',499.99,2,0.00),(17,'\"My Neighbor Totoro\" Blu-Ray','Movies',29.99,20,0.00),(18,'Nerf N-Strike Elite Surgefire','Toys',17.99,5,89.95),(19,'Monopoly','Toys',29.99,15,0.00),(20,'Hanes 5-Pack Crew Neck White T-Shirts, XL','Clothing',15.99,20,159.90),(21,'Levi Jeans','Clothing',19.99,10,199.90),(22,'\"Fight Club\" Blu-Ray','Movies',10.99,10,549.50),(23,'Mega Man Amiibo','Toys',14.99,7,44.97),(24,'Shulk Amiibo','Toys',14.99,10,0.00),(25,'Bananas, One Bunch','Grocery',5.99,6,83.86);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-07-25 16:32:29
