CREATE TABLE `user_info` (
  `id`          bigint(64) unsigned NOT  NULL  AUTO_INCREMENT,
  `mobile`      varchar(255) NOT NULL COMMENT '手机号，全局唯一',
  `password`    varchar(255) NOT NULL COMMENT '密码',
  `salt`        varchar(255) NOT NULL COMMENT '盐',
  `create_time` DATETIME  NOT NULL,
  `update_time` DATETIME  NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (mobile, id)
)
  ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4;