-- CREATE TABLE IF NOT EXISTS `laptop_darknet_posts` (
--     `id` int(11) NOT NULL AUTO_INCREMENT,
--     `citizenid` varchar(50) NOT NULL,
--     `user_handle` varchar(255) NOT NULL,
--     `title` varchar(255) NOT NULL,
--     `description` text NOT NULL,
--     `category` varchar(50) NOT NULL,
--     `hidden` text DEFAULT NULL,
--     `hidden_shown` boolean NOT NULL DEFAULT 0, 
--     `date` datetime DEFAULT current_timestamp(),

--     PRIMARY KEY (`id`),
--     KEY `citizenid` (`citizenid`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=1

CREATE TABLE IF NOT EXISTS `laptop_darknet_users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `citizenid` varchar(50) NOT NULL,
    `username` varchar(100) NOT NULL,
    `password` varchar(255) NOT NULL,
    `created_at` datetime DEFAULT current_timestamp(),
    `profile_picture_url` varchar(255) DEFAULT NULL,

    PRIMARY KEY (`id`),
    KEY `citizenid` (`citizenid`)
) ENGINE=InnoDB AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `laptop_darknet_posts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `citizenid` varchar(50) NOT NULL,
    `user_id` int(11) NOT NULL,
    `title` varchar(255) NOT NULL,
    `description` text NOT NULL,
    `category` varchar(50) NOT NULL,
    `hidden` text DEFAULT NULL,
    `hidden_shown` boolean NOT NULL DEFAULT 0, 
    `created_at` datetime DEFAULT current_timestamp(),

    PRIMARY KEY (`id`),
    KEY `citizenid` (`citizenid`)
) ENGINE=InnoDB AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `laptop_darknet_post_replies` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `post_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `comment` text NOT NULL,
    `created_at` datetime DEFAULT current_timestamp(),

    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1;
