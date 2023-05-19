<?php

require_once 'app/models/MenuItemModel.php';
require_once 'app/middleware/PermissionMiddleware.php';

class MenuController
{
    public function create()
    {
        $data = json_decode(file_get_contents("php://input"));
        
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }

        $menuItem = new MenuItemModel();
        $menuItem->label = $data->label;
        $menuItem->subLabel = $data->subLabel;
        $menuItem->url = $data->url;
        $menuItem->parent_id = $data->parent_id;

        if ($menuItem->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "Menu item was created"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create menu item"));
            return;
        }
    }


    public function getMany()
    {
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher','student');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }

        $menuItem = new MenuItemModel();

        $menuItems = $menuItem->get();
        if ($menuItems) {
            http_response_code(200);
            echo json_encode($menuItems);
            return;
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No menu items found"));
            return;
        }
    }

    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"));
        
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }

        $menuItem = new MenuItemModel();
        $menuItem->id = $id;
        $menuItem->label = $data->label;
        $menuItem->subLabel = $data->subLabel;
        $menuItem->url = $data->url;
        $menuItem->parent_id = $data->parent_id;

        if ($menuItem->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Menu item was updated"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update menu item"));
            return;
        }
    }

    public function delete($id)
    {
        $data = json_decode(file_get_contents("php://input"));
        
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }

        $menuItem = new MenuItemModel();
        $menuItem->id = $id;

        if ($menuItem->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Menu item was deleted"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to delete menu item"));
            return;
        }
    }
    
}