<?php

require_once 'app/models/CourseModel.php';
require_once 'app/models/CategoryModel.php';
require_once 'app/controllers/MediaController.php';

require_once 'app/middleware/PermissionMiddleware.php';

class CoursesController
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
        $data = $_POST;
        if (empty($data)) {
            http_response_code(400);
            echo json_encode(array("message" => "No data provided"));
            return;
        }
        $course = new CourseModel();
        $course->id = intval($course->getLastId())+1;
        if (isset($_FILES["thumbnail"])) {
            $Media = new MediaController();
            $Media->uploadImage($_FILES["thumbnail"], 'courses', $course->id, 800, 450);
            if(isset($Media->fileUrl)) {
                $course->thumbnail_url = $Media->fileUrl;
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

        if ($data['name'] !== $course->name) {
            $course->name = $data['name'];
        }
        if ($data['slug'] !== $course->slug) {
            $course->slug = $data['slug'];
        }
        if ($data['description'] !== $course->description) {
            $course->description = $data['description'];
        }
        if ($data['category'] !== $course->category) {
            $course->category = $data['category'];
        }
        if ($data['keywords'] !== $course->keywords) {
            $course->keywords = $data['keywords'];
        }

        $course->create_date = date('Y-m-d H:i:s');
        $course->create_uid = $UserPermmited->id;

        if ($course->create()) {
            http_response_code(201);
            echo json_encode(array(
                "message" => "Course was created",
                "id" => intval($course->id),
                "name" => $course->name,
                "slug" => $course->slug,
                "description" => $course->description,
                "category" => $course->category,
                "keywords" => $course->keywords,
                "courseContents" => $course->courseContents,
                "create_date" => $course->create_date,
                "create_uid" => $course->create_uid,
                "thumbnail_url" => $course->thumbnail_url
            ));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create course"));
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

        $course = new CourseModel();
        $Category = new CategoryModel();

    
        $args = array();
        $page = isset($_GET['page']) ? $_GET['page'] : 1;
        if (isset($_GET['category'])){
            $Category->getOne($_GET['category']);
        }
        $search = isset($_GET['search']) ? $_GET['search'] : null;

        if ($Category->id) {
            $args[] = "category = '{$Category->id}'";
        }
        if ($search) {
            $args[] = "name LIKE '%{$search}%'";
        }

        $records_per_page = isset($_GET['limit']) ? $_GET['limit'] : 12;
        $courses = $course->getMany($args, $page, $records_per_page);
        if ($Category->name){
            $courses['category'] = $Category;
        }
        if ($courses) {
            http_response_code(200);
            echo json_encode($courses);
            return;
        } else {
            http_response_code(204);
            echo json_encode(array("message" => "No courses found"));
            return;
        }
    }

    public function getManyByCategory($slug){
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher','student');
        $UserPermmited = $PermissionMiddleware->handle($allowed);

        if (!$UserPermmited) {
            return;
        }

        $course = new CourseModel();
        $Category = new CategoryModel();
        $args = array();
        $page = isset($_GET['page']) ? $_GET['page'] : 1;
        $Category->getOne($slug);
        if (!$Category->id) {
            http_response_code(404);
            echo json_encode(array("message" => "Category not found"));
            return;
        }
        $search = isset($_GET['search']) ? $_GET['search'] : null;
        
        if ($search) {
            $args[] = "name LIKE '%{$search}%'";
        }

        $records_per_page = isset($_GET['limit']) ? $_GET['limit'] : 12;
        $courses = $course->getManyByCategory($Category->id, $args, $page, $records_per_page);
        if ($Category->name){
            $courses['category'] = $Category;
        }
        if ($courses) {
            http_response_code(200);
            echo json_encode($courses);
            return;
        } else {
            http_response_code(204);
            echo json_encode(array("message" => "No courses found"));
            return;
        }
    }

    public function getOne($slug)
    {
        try {
            $course = new CourseModel();
            $slugArray = explode("-", $slug);
            $courseId = end($slugArray);
            $course->id = $courseId;

            if ($course->getOne()) {
                http_response_code(200);
                $returnArray = array(
                    "name" => $course->name,
                    "description" => $course->description,
                    "category" => $course->category,
                    "keywords" => $course->keywords,
                    "courseContents" => $course->courseContents,
                    "create_date" => $course->create_date,
                    "create_uid" => $course->create_uid,
                    "thumbnail_url" => $course->thumbnail_url
                );
                echo json_encode($returnArray);
                return;
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Course not found"));
                return;
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => "Course not found"));
            return;
        }
    }

    public function checkIfExists($CourseId)
    {
        $course = new CourseModel();
        $course->id = $CourseId;

        if ($course->getOne()) {
            return true;
        } else {
            return false;
        }
    }

    public function getSuccessResponse()
    {
        http_response_code(200);
        echo json_encode(array("message" => "Success"));
        return;
    }
}
