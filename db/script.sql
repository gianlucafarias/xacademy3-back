-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema xacademydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema xacademydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `xacademydb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `xacademydb` ;

-- -----------------------------------------------------
-- Table `xacademydb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `xacademydb`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `lastname` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  `uuid` VARCHAR(255) NULL DEFAULT NULL,
  `userRole` ENUM('ADMIN', 'TEACHER', 'STUDENT') NOT NULL,
  `birthday` DATE NULL DEFAULT NULL,
  `dni` INT NULL DEFAULT NULL,
  `phone` VARCHAR(20) NULL DEFAULT NULL,
  `address` VARCHAR(255) NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE,
  INDEX `users_name` (`name` ASC) VISIBLE,
  INDEX `users_lastname` (`lastname` ASC) VISIBLE,
  INDEX `users_dni` (`dni` ASC) VISIBLE,
  INDEX `users_email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `xacademydb`.`courses_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `xacademydb`.`courses_category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `xacademydb`.`teacher`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `xacademydb`.`teacher` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `specialty` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `teacher_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `xacademydb`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `xacademydb`.`courses`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `xacademydb`.`courses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `quota` INT NOT NULL,
  `startDate` DATE NOT NULL,
  `endDate` DATE NOT NULL,
  `hours` INT NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `category_id` INT NULL DEFAULT NULL,
  `teacher_id` INT NOT NULL,
  `modalidad` ENUM('PRESENCIAL', 'VIRTUAL', 'HÍBRIDO') NOT NULL,
  `status` ENUM('PENDIENTE', 'ACTIVO', 'FINALIZADO') NOT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT '1',
  `image_url` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_courses_courses_category_idx` (`category_id` ASC) VISIBLE,
  INDEX `fk_courses_teacher_idx` (`teacher_id` ASC) VISIBLE,
  CONSTRAINT `fk_courses_courses_category`
    FOREIGN KEY (`category_id`)
    REFERENCES `xacademydb`.`courses_category` (`id`),
  CONSTRAINT `fk_courses_teacher`
    FOREIGN KEY (`teacher_id`)
    REFERENCES `xacademydb`.`teacher` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 21
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `xacademydb`.`student`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `xacademydb`.`student` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `qualification` DECIMAL(5,2) NULL DEFAULT NULL,
  `studentCondition` ENUM('EN_CURSO', 'APROBADO', 'DESAPROBADO') NOT NULL,
  `payment_status` ENUM('PENDIENTE', 'PAGADO', 'ATRADADO') NOT NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `course_id` (`course_id` ASC) VISIBLE,
  CONSTRAINT `student_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `xacademydb`.`users` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `student_ibfk_2`
    FOREIGN KEY (`course_id`)
    REFERENCES `xacademydb`.`courses` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `xacademydb`.`class`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `xacademydb`.`class` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `topic` VARCHAR(500) NULL DEFAULT NULL,
  `class_date` DATE NOT NULL,
  `course_id` INT NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_class_courses_idx` (`course_id` ASC) VISIBLE,
  CONSTRAINT `fk_class_courses`
    FOREIGN KEY (`course_id`)
    REFERENCES `xacademydb`.`courses` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `xacademydb`.`assists`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `xacademydb`.`assists` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `class_id` INT NOT NULL,
  `attendance` TINYINT NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `student_id` (`student_id` ASC) VISIBLE,
  INDEX `fk_assists_class1_idx` (`class_id` ASC) VISIBLE,
  CONSTRAINT `assists_ibfk_2`
    FOREIGN KEY (`student_id`)
    REFERENCES `xacademydb`.`student` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_assists_class1`
    FOREIGN KEY (`class_id`)
    REFERENCES `xacademydb`.`class` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `xacademydb`.`certificate`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `xacademydb`.`certificate` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `issue_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('PENDIENTE', 'EMITIDO', 'REVOCADO') NULL DEFAULT 'PENDIENTE',
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `student_id` (`student_id` ASC) VISIBLE,
  INDEX `course_id` (`course_id` ASC) VISIBLE,
  CONSTRAINT `certificate_ibfk_1`
    FOREIGN KEY (`student_id`)
    REFERENCES `xacademydb`.`student` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `certificate_ibfk_2`
    FOREIGN KEY (`course_id`)
    REFERENCES `xacademydb`.`courses` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `xacademydb`.`inscription`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `xacademydb`.`inscription` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `course_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `regirationDate` DATETIME NULL DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `course_id` (`course_id` ASC) VISIBLE,
  INDEX `student_id` (`student_id` ASC) VISIBLE,
  CONSTRAINT `inscription_ibfk_1`
    FOREIGN KEY (`course_id`)
    REFERENCES `xacademydb`.`courses` (`id`)
    ON UPDATE CASCADE,
  CONSTRAINT `inscription_ibfk_2`
    FOREIGN KEY (`student_id`)
    REFERENCES `xacademydb`.`student` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 26
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `xacademydb`.`news`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `xacademydb`.`news` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(150) NOT NULL,
  `user_id` INT NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `image` VARCHAR(255) NULL DEFAULT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  CONSTRAINT `news_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `xacademydb`.`users` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `xacademydb`.`payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `xacademydb`.`payment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `course_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('PENDIENTE', 'PAGADO', 'ATRASADO') NOT NULL,
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `course_id` (`course_id` ASC) VISIBLE,
  INDEX `student_id` (`student_id` ASC) VISIBLE,
  CONSTRAINT `payment_ibfk_1`
    FOREIGN KEY (`course_id`)
    REFERENCES `xacademydb`.`courses` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `payment_ibfk_2`
    FOREIGN KEY (`student_id`)
    REFERENCES `xacademydb`.`student` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 14
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `xacademydb`.`sequelizemeta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `xacademydb`.`sequelizemeta` (
  `name` VARCHAR(255) COLLATE 'utf8mb3_unicode_ci' NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
