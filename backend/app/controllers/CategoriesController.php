<?php

require_once 'app/models/CategoryModel.php';
require_once 'app/middleware/PermissionMiddleware.php';

class CategoriesController
{
    public function create()
    {
        $data = json_decode(file_get_contents("php://input"));
        
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }

        $category = new CategoryModel();
        $category->name = $data->name;
        $category->slug = $data->slug;
        $category->description = $data->description;
        $category->image_url = $data->image_url;
        $category->parent_cat = $data->parent_cat;
        $category->keywords = implode(",", $data->keywords);
        $category->create_uid = $UserPermmited->id;

        if ($category->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "Category was created"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create category"));
            return;
        }
    }

    public function update($id)
    {
        $data = json_decode(file_get_contents("php://input"));
        
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }

        $category = new CategoryModel();
        $category->id = $id;
        $category->name = $data->name;
        $category->slug = $data->slug;
        $category->description = $data->description;
        $category->image_url = $data->image_url;
        $category->parent_cat = $data->parent_cat;
        $category->keywords = implode(",", $data->keywords);
        $category->create_uid = $UserPermmited->id;

        if ($category->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Category was updated"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update category"));
            return;
        }
    }

    public function delete($id)
    {
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }

        $category = new CategoryModel();
        $category->id = $id;

        if ($category->delete($id)) {
            http_response_code(200);
            echo json_encode(array("message" => "Category was deleted"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to delete category"));
            return;
        }
    }

    public function getAll()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {

            $category = new CategoryModel();

            if (isset($_GET['offset']) && isset($_GET['limit'])) {
                $from_record_num = $_GET['offset'];
                $records_per_page = $_GET['limit'];
            } else {
                $from_record_num = 0;
                $records_per_page = 10;
            }
            $categories = $category->getAll($from_record_num, $records_per_page);

            if ($categories) {
                http_response_code(200);
                echo json_encode($categories);
                return;
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No category found"));
                return;
            }
        }
    }

    public function getOne($slug)
    {
        $data = json_decode(file_get_contents("php://input"));

        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }

        try {
            $category = new CategoryModel();
            $slugArray = explode("-", $slug);
            $categoryId = end($slugArray);
            $category->id = $categoryId;

            if ($category->getOne($slug)) {
                http_response_code(200);
                $returnArray = array(

                    "name" => $category->name,
                    "slug" => $category-> slug,
                    "description" => $category-> description,
                    "image_url" => $category-> image_url,
                    "parent_cat" => $category-> parent_cat,
                    "keywords" => $category-> keywords,
                    "create_uid" => $category-> create_uid
                );
                echo json_encode($returnArray);
                return;
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Category not found"));
                return;
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => "Category not found"));
            return;
        }
    }

}
