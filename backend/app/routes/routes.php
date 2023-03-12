<?php

require_once 'app/controllers/UserController.php';

$request_uri = explode('?', $_SERVER['REQUEST_URI'], 2);

switch ($request_uri[0]) {
    case '/api/register':
        $controller = new UserController();
        $controller->register();
        break;

    case '/api/login':
        $controller = new UserController();
        $controller->login();
        break;

    default:
        http_response_code(404);
        echo json_encode(array("message" => "Route not found"));
        break;
}
?>