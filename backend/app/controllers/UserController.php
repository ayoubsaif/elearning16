<?php

require_once 'app/models/UserModel.php';

require 'vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class UserController {
    public function register() {
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"));
            
            $user = new UserModel();
            $user->firstname = $data->firstname;
            $user->lastname = $data->lastname;
            $user->email = $data->email;
            $user->password = $data->password;

            if($user->emailExists()) {
                http_response_code(400);
                echo json_encode(array("message" => "Email already exists"));
                return;
            }

            if($user->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "User was created."));
                return;
            }

            http_response_code(503);
            echo json_encode(array("message" => "Unable to create user."));
        }else{
            http_response_code(405);
            echo json_encode(array("message" => "Method not allowed."));
        }
    }

    public function login() {
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"));

            $user = new UserModel();
            $user->email = $data->email;

            if(!$user->emailExists() || !$user->validatePassword($data->password)) {
                http_response_code(401);
                echo json_encode(array("message" => "Login failed."));
                return;
            }

            http_response_code(401);
            $token = array(
                "iat" => time(),
                "exp" => time() + 3600,
                "data" => array(
                    "id" => $user->id,
                    "name" => $user->display_name,
                    "email" => $user->email
                )
            );

            $jwt = JWT::encode($token, getenv("JWT_KEY"),"HS256");

            http_response_code(200);
            echo json_encode(array("message" => "Login successful.", "jwt" => $jwt, "user"=>array("id" => $user->id, "name" => $user->display_name)));

        }else{
            http_response_code(405);
            echo json_encode(array("message" => "Method not allowed."));
        }
    }

    public function getUserByToken($id) {
        // Get the JWT token from the Authorization header
        $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
        $token = str_replace('Bearer ', '', $auth_header);

        // Verify and decode the token
        try {
            $decoded_token = JWT::decode($token, getenv("JWT_KEY"), array('HS256'));
            $user_id = $decoded_token->data->id;
            // Check if the authenticated user ID matches the requested user ID
            if ($user_id != $id) {
                // Return a 403 Forbidden response if the authenticated user is not authorized to access the requested user's information
                http_response_code(403);
                echo json_encode(array("message" => "Forbidden."));
                return;
            }
            // Retrieve the user's information from the database and return it
            
            $user = new UserModel();
            $user->id = $id;
            $user->getOne($id);
            $user_arr = array(
                "id" => $user->id,
                "name" => $user->firstname,
                "email" => $user->email
            );
            http_response_code(200);
            echo json_encode($user_arr);
        } catch (Exception $e) {
            // Return a 401 Unauthorized response if the token is invalid
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized."));
            return;
        }
    }

    public function validateToken($token) {
        try {
            $key = new Key(getenv("JWT_KEY"), 'HS256');
            $decoded_token = JWT::decode($token, $key);
            $user_id = $decoded_token->data->id;
            $user = new UserModel();
            $user->id = $user_id;
            $user->getOne($user_id);
            return $user;
        } catch (Exception $e) {
            return false;
        }
    }
}

?>