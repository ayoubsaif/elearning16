<?php

require_once 'app/models/SiteConfigModel.php';
require_once 'app/middleware/PermissionMiddleware.php';

class SiteConfigController
{
    function get() {
        try{
            $siteConfig = new SiteConfigModel();
            $siteConfigArray = $siteConfig->get();
            if ($siteConfigArray) {
                http_response_code(200);
                echo json_encode($siteConfigArray);
                return;
            } else {
                http_response_code(500);
                echo json_encode(array("message" => "Site Config Not found, Please contact administrator"));
                return;
            }
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized"));
        }
    }

    function update(){
        try{
            $PermissionMiddleware = new PermissionMiddleware();
            $allowed = array('admin');
            $UserPermmited = $PermissionMiddleware->handle($allowed);
            if (!$UserPermmited) {
                return;
            }
            $data = $_POST;
            # loop in all port array to conver it to object
            foreach ($_POST as $key => $value) {
                $data[$key] = $value;
            }

            if (isset($_FILES["image"])) {
                $Media = new MediaController();
                $Media->uploadImage($_FILES["image"], 'siteconfig', 1, 800, 450);
                if(isset($Media->fileUrl)) {
                    $data['image'] = $Media->fileUrl;
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Unable to upload thumbnail"));
                    return;
                }
            }else{
                http_response_code(401);
                echo json_encode(array("message" => "You need to upload a thumbnail"));
                return;
            }

            $update_state = [];
            foreach ($data as $key => $value) {
                $siteConfig = new SiteConfigModel();
                $siteConfig->variable = $key;
                $siteConfig->value = strval($value);
                if ($siteConfig->update()) {
                    array_push($update_state, array("status" => "success","message" => "{$key} was updated"));
                } else {
                    array_push($update_state, array("status" => "error", "message" => "Unable to update site config"));
                }
            }

            if (!empty($update_state)) {
                http_response_code(200);
                echo json_encode($update_state);
                return;
            }else{
                http_response_code(500);
                echo json_encode(array("message" => "Unable to update site config"));
                return;
            }

        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized {$e->getMessage()}"));
        }
    }

    function getSuccessResponse(){
        http_response_code(200);
        echo json_encode(array("message" => "Success"));
    }
}