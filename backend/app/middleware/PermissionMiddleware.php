<?php

require_once 'app/middleware/Middleware.php';
require_once 'app/controllers/UserController.php';

class PermissionMiddleware extends Middleware
{
    public function __construct()
    {
        parent::__construct();
    }

    public function handle($allowed)
    {
        $headers = apache_request_headers();

        if (isset($headers['Authorization'])) {
            $authorizationHeader = $headers['Authorization'];

            // Comprobamos si el encabezado contiene la etiqueta 'Bearer'
            if (preg_match('/Bearer\s(\S+)/', $authorizationHeader, $matches)) {
                $token = $matches[1];
                if ($token) {
                    $user = new UserController();
                    $user = $user->validateToken($token);
                    if (isset($user->id)) {
                        if (in_array($user->role, $allowed)) {
                            session_start();
                            $_SESSION['user'] = intval($user->id);
                            return $user;
                        } else {
                            http_response_code(403);
                            echo json_encode(array("message" => "No tiene permiso para acceder a este recurso"));
                            return false;
                        }
                    } else {
                        http_response_code(401);
                        echo json_encode(array("message" => "Token expirado o no válido, Inicie sesión nuevamente"));
                        return false;
                    }
                }
            } else {
                http_response_code(401);
                echo json_encode(array("message" => "No se ha proporcionado token"));
                return false;
            }
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "No se ha proporcionado autorización"));
            return false;
        }
    }
}
