<?php

require_once 'app/models/SiteConfigModel.php';
require_once 'app/middleware/PermissionMiddleware.php';

class SiteConfigController
{
    function get() {
        try{
            $siteConfig = new SiteConfigModel();
            if ($siteConfig->get()) {
                http_response_code(200);
                echo json_encode($siteConfig);
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

}