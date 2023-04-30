<?php

require_once 'app/middleware/Middleware.php';
require_once 'app/controllers/UserController.php';
require_once 'app/controllers/CoursesController.php';

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

    case '/api/courses':
        $controller = new CoursesController();
        $controller->getAll();
        break;

    case '/api/course':
        switch ($_SERVER['REQUEST_METHOD']){
            case 'GET':
                $controller = new CoursesController();
                $controller->getOne();
                break;
            case 'POST':
                $controller = new CoursesController();
                $controller->create();
                break;
            case 'PUT':
                $controller = new CoursesController();
                //$controller->update();
                break;
            case 'DELETE':
                $controller = new CoursesController();
                //$controller->delete();
                break;
            default:
                http_response_code(404);
                echo json_encode(array("message" => "Route not found"));
                break;
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(array("message" => "Route not found"));
        break;
}
?>