<?php

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    header("Content-Type: text/html; charset=utf-8");
    require_once 'connection.php';
    require_once 'smtp.php';
    require_once 'application/bootstrap.php';

?>
