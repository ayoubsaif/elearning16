<?php

use Firebase\JWT\JWT;

class RoutesController {
    
    public function index() {
        include "app/routes/routes.php";
    }

    
    private function checkToken() {
        $headers = getallheaders();
      
        if (!isset($headers['Authorization']) || empty($headers['Authorization'])) {
          http_response_code(401);
          echo json_encode(array("message" => "Token is missing"));
          exit();
        }
      
        $token = $headers['Authorization'];
        $token = str_replace("Bearer ", "", $token);
      
        try {
          $decoded = JWT::decode($token, "your_secret_key", array('HS256'));
          // If the token is valid, you can retrieve the user ID from the token payload
          $user_id = $decoded->user_id;
          // You can then use the $user_id to look up the user in the database, if necessary
        } catch (Exception $e) {
          http_response_code(401);
          echo json_encode(array("message" => "Invalid token"));
          exit();
        }
    }
}

?>