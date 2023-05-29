<?php

require_once 'app/models/UserModel.php';
require_once 'app/middleware/PermissionMiddleware.php';

require_once 'app/controllers/MediaController.php';

require 'vendor/autoload.php';

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

class UserController
{
    public function register()
    {
        try {
            $data = json_decode(file_get_contents("php://input"));

            $user = new UserModel();
            $user->firstname = $data->firstname;
            $user->lastname = $data->lastname;

            if(isset($data->username) && !empty($data->username)){
                $user->username = $data->username;
            }else{
                $user->username = explode("@", $data->email)[0]."_".uniqid();
            }
            $user->email = $data->email;
            $user->password = $data->password;

            if ($user->emailExists()) {
                http_response_code(400);
                echo json_encode(array("message" => "Email already exists"));
                return;
            }

            if ($user->create()) {
                http_response_code(201);
                echo json_encode(array("message" => "User was created"));
                return;
            }

            http_response_code(503);
            echo json_encode(array("message" => "Unable to create user"));
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized"));
        }
    }

    public function login()
    {
        try {
            $data = json_decode(file_get_contents("php://input"));

            $user = new UserModel();
            $user->email = $data->email;

            if (!$user->emailExists() || !$user->validatePassword($data->password)) {
                http_response_code(401);
                echo json_encode(array("message" => "Login failed"));
                return;
            }

            $this->successAuthResponse($user);
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized"));
        }
    }

    public function googleAuth()
    {
        try {
            $data = json_decode(file_get_contents("php://input"));
            $user = new UserModel();
            $user->email = $data->email;
            $user->firstname = $data->firstname;
            $user->lastname = $data->lastname;
            $user->username = isset($data->username) ? $data->username : explode("@", $data->email)[0]."_".uniqid();
            $user->avatar_url = isset($data->image) ? $data->image : null;
            $user->google_id = strval($data->google_id);
            if (!$user->emailExists()) {
                if ($user->create()) {
                    if ($user->emailExists())
                    {
                        http_response_code(201);
                        $this->successAuthResponse($user);
                    }else{
                        http_response_code(503);
                        echo json_encode(array("message" => "No se puede crear el usuario"));
                    }
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "No se puede crear el usuario"));
                }
            } else {
                $user->googleIdUpdate();
                $this->successAuthResponse($user);
            }
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array("message" => "No autorizado"));
        }
    }

    public function successAuthResponse($user)
    {
        $key = getenv("JWT_KEY");
        $token = array(
            "iat" => time(),
            "exp" => time() + 30 * 24 * 60 * 60,
            "data" => array(
                "id" => $user->id,
                "name" => $user->display_name,
                "email" => $user->email,
                "username" => $user->username,
            )
        );

        $jwt = JWT::encode($token, $key, "HS256");

        http_response_code(200);
        echo json_encode(array(
            "status" => "success",
            "id" => intval($user->id),
            "name" => $user->display_name,
            "firstname" => $user->firstname,
            "email" => $user->email,
            "username" => $user->username,
            "image" => $user->avatar_url,
            "role" => $user->role,
            "accessToken" => $jwt,
            "exp" => $token['exp'],
        ));
    }

    public function getMyProfileInfo()
    {
        try {
            $PermissionMiddleware = new PermissionMiddleware();
            $allowed = array('admin', 'teacher', 'student');
            $UserPermmited = $PermissionMiddleware->handle($allowed);
            if (!$UserPermmited) {
                return;
            }

            $user_id = $UserPermmited->id;
            $user = new UserModel();
            $user->id = $user_id;
            $user->getOne($user_id);
            http_response_code(200);
            echo json_encode(array(
                "id" => $user->id,
                "name" => $user->display_name,
                "username" => $user->username,
                "firstname" => $user->firstname,
                "lastname" => $user->lastname,
                "username" => $user->username,
                "email" => $user->email,
                "image" => $user->avatar_url,
                "bio" => $user->bio,
            ));
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized"));
        }
    }

    public function updateMyProfileInfo()
    {
        try {
            $PermissionMiddleware = new PermissionMiddleware();
            $allowed = array('admin', 'teacher', 'student');
            $UserPermmited = $PermissionMiddleware->handle($allowed);
            if (!$UserPermmited) {
                return;
            }
    
            $user_id = $UserPermmited->id;
            $user = new UserModel();
            $user->id = $user_id;
            $user->getOne($user_id);
    
            $data = $_POST;
            if (empty($data)) {
                http_response_code(400);
                echo json_encode(array("message" => "No data provided"));
                return;
            }
            $updateProfileValues = [];
            if (isset($_FILES["image"])) {
                $Media = new MediaController(new MediaModel());
                if ($Media->uploadImage($_FILES["image"], 'users', $user->id, 500, 500, "update")) {
                    $user->avatar_url = $Media->fileUrl;
                    $updateProfileValues[] = "avatar_url = '{$user->avatar_url}'";
                }else{
                    http_response_code(503);
                    echo json_encode(array("message" => "Unable to upload image"));
                    return;
                }
            }

            if ($data['firstname'] !== $user->firstname) {
                $user->firstname = htmlspecialchars(strip_tags($data['firstname']));
                $updateProfileValues[] = "firstname = '{$user->firstname}'";
            }
            if ($data['lastname'] !== $user->lastname) {
                $user->lastname = htmlspecialchars(strip_tags($data['lastname']));
                $updateProfileValues[] = "lastname = '{$user->lastname}'";
            }
            if ($data['username'] !== $user->username) {
                $user->username = htmlspecialchars(strip_tags($data['username']));
                $updateProfileValues[] = "username = '{$user->username}'";
            }
            if ($data['bio'] !== $user->bio) {
                $user->bio = htmlspecialchars(strip_tags($data['bio']));
                $updateProfileValues[] = "bio = '{$user->bio}'";
            }
    
            if ($user->updateProfile($updateProfileValues)) {
                http_response_code(200);
                echo json_encode(array(
                    "id" => intval($user->id),
                    "name" => $user->display_name,
                    "firstname" => $user->firstname,
                    "lastname" => $user->lastname,
                    "username" => $user->username,
                    "bio" => $user->bio,
                    "email" => $user->email,
                    "image" => $user->avatar_url
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update user info"));
            }
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized", "error" => $e->getMessage()));
        }
    }

    public function validateToken($token)
    {
        try {
            $key = new Key(getenv("JWT_KEY"), 'HS256');
            $decoded_token = JWT::decode($token, $key);
    
            // Check if the token has expired
            $current_time = time();
            
            if ( !isset($decoded_token->exp) || $decoded_token->exp < $current_time) {
                return false;
            }
    
            $user_id = $decoded_token->data->id;
            $user = new UserModel();
            $user->id = $user_id;
            $user->getOne($user_id);
            return $user;
        } catch (Exception $e) {
            return $e->getMessage(); // Return the error message
        }
    }
    
    public function getOne($id){
        $user = new UserModel();
        $user->id = $id;
        if($user->getOne($id)){
            return $user;
        }else{ 
            return false;
        }
    }

    public function getMany()
    {
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }
        $user = new UserModel();
        $users = $user->getMany();
        if ($users) {
            http_response_code(200);
            echo json_encode($users);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No users found"));
        }
    }

    public function getSuccessResponse()
    {
        http_response_code(200);
        echo json_encode(array("message" => "Success"));
    }
}
