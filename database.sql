/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 100422
 Source Host           : localhost:3306
 Source Schema         : elearning_16

 Target Server Type    : MySQL
 Target Server Version : 100422
 File Encoding         : 65001

 Date: 07/05/2023 18:51:18
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for attachments
-- ----------------------------
DROP TABLE IF EXISTS `attachments`;
CREATE TABLE `attachments`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `course_content` bigint(20) NOT NULL,
  `create_date` datetime(0) NULL DEFAULT NULL,
  `create_uid` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `attachments.course_content`(`course_content`) USING BTREE,
  INDEX `attachments.create_uid`(`create_uid`) USING BTREE,
  CONSTRAINT `attachments.course_content` FOREIGN KEY (`course_content`) REFERENCES `course_content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attachments.create_uid` FOREIGN KEY (`create_uid`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `parent_cat` int(255) NULL DEFAULT NULL,
  `keywords` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `create_uid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `create_uid`(`create_uid`) USING BTREE,
  INDEX `category_parent`(`parent_cat`) USING BTREE,
  CONSTRAINT `category_parent` FOREIGN KEY (`parent_cat`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `create_uid` FOREIGN KEY (`create_uid`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `course_content` bigint(20) NULL DEFAULT NULL,
  `user` int(11) NULL DEFAULT NULL,
  `parent_comment` bigint(20) NULL DEFAULT NULL,
  `create_date` datetime(0) NULL DEFAULT NULL,
  `create_uid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user`(`user`) USING BTREE,
  INDEX `comments.coursecontent`(`course_content`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  INDEX `comments.parent_comment`(`parent_comment`) USING BTREE,
  CONSTRAINT `comments.coursecontent` FOREIGN KEY (`course_content`) REFERENCES `course_content` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `comments.parent_comment` FOREIGN KEY (`parent_comment`) REFERENCES `comments` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user` FOREIGN KEY (`user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for course_content
-- ----------------------------
DROP TABLE IF EXISTS `course_content`;
CREATE TABLE `course_content`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `iframe` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `course` int(11) NOT NULL,
  `create_date` datetime(0) NOT NULL,
  `create_uid` int(11) NOT NULL,
  PRIMARY KEY (`id`, `slug`) USING BTREE,
  INDEX `course_content.create_uid`(`create_uid`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  CONSTRAINT `course_content.create_uid` FOREIGN KEY (`create_uid`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `thumbnail_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `category` int(11) NULL DEFAULT NULL,
  `teacher` int(11) NULL DEFAULT NULL,
  `keywords` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `create_date` datetime(0) NULL DEFAULT NULL,
  `create_uid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `courses_create_uid`(`create_uid`) USING BTREE,
  INDEX `courses_teacher`(`teacher`) USING BTREE,
  INDEX `courses.category`(`category`) USING BTREE,
  CONSTRAINT `courses.category` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  CONSTRAINT `courses_create_uid` FOREIGN KEY (`create_uid`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `courses_teacher` FOREIGN KEY (`teacher`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 56 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for site_config
-- ----------------------------
DROP TABLE IF EXISTS `site_config`;
CREATE TABLE `site_config`  (
  `variable` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`variable`) USING BTREE,
  UNIQUE INDEX `variable.unique`(`variable`) USING BTREE COMMENT 'Unique variable name'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'User Firstname',
  `lastname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'User Lastname',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'E-Mail for contact and login',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'User Password for login pruposes',
  `permission_type` enum('admin','teacher','student') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Permission Type Admin, Teacher or Student',
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'Avatar iamge URL',
  `active` tinyint(4) NULL DEFAULT NULL COMMENT 'State of user',
  PRIMARY KEY (`id`, `email`) USING BTREE,
  UNIQUE INDEX `Id`(`id`) USING BTREE COMMENT 'id',
  UNIQUE INDEX `Unique email`(`email`) USING BTREE COMMENT 'email',
  UNIQUE INDEX `Unique username`(`username`) USING BTREE COMMENT 'username'
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
