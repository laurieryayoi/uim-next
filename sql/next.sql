CREATE TABLE IF NOT EXISTS `uim_next` (
  `id`             int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key`            varchar(128)     NOT NULL COMMENT '配置键名',
  `type`           varchar(32)      NOT NULL COMMENT '值类型',
  `value`          text             NOT NULL COMMENT '配置值',
  `name`           varchar(128)     NOT NULL COMMENT '配置名称',
  `comment`        text             NOT NULL COMMENT '配置描述',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='网站配置';