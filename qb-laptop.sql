CREATE TABLE IF NOT EXISTS `laptop_darknet_posts` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `citizenid` varchar(50) NOT NULL,
    `title` varchar(255) NOT NULL,
    `description` text NOT NULL,
    `category` varchar(50) NOT NULL,
    `hidden` text DEFAULT NULL,
    `hidden_shown` boolean NOT NULL DEFAULT 0, 
    `date` datetime DEFAULT current_timestamp(),

    PRIMARY KEY (`id`),
    KEY `citizenid` (`citizenid`)
) ENGINE=InnoDB AUTO_INCREMENT=1