<?php
  include 'config/database.php';
  class Db {
    private static $instance = NULL;
    private function __construct() {}
    private function __clone() {}
    public static function getInstance() {
      global $DB_DSN;
      global $DB_USER;
      global $DB_PASSWORD;
      if (!isset(self::$instance)) {
        $pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
        self::$instance = new PDO($DB_DSN, $DB_USER, $DB_PASSWORD, $pdo_options);
      }
      return self::$instance;
    }
  }
?>


