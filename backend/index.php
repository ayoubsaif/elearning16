<?php

/*
Show errors
*/
ini_set('display_errors', 1);
ini_set("log_errors", 1);
ini_set("error_log", "./logs/error.log");

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json; charset=utf-8');

# DB Connection
require_once "app/config/database.php";
# Routes controller
require_once "app/controllers/RoutesController.php";

$index = new RoutesController();
$index -> index();
?>