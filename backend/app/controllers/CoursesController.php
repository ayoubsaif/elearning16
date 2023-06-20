<?php

require_once 'app/models/CourseModel.php';
require_once 'app/models/CategoryModel.php';
require_once 'app/controllers/MediaController.php';

require_once 'app/middleware/PermissionMiddleware.php';

class CoursesController
{
    public function create()
    {
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
                "thumbnail" => $course->thumbnail_url
            ));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create course"));
            return;
        }
    }

    public function update($id)
    {
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
        $course->getOne($id);
        if (!$course->id) {
            http_response_code(404);
            echo json_encode(array("message" => "Course not found"));
            return;
        }
        
        $setClouse = [];
        
        if (isset($_FILES["thumbnail"])) {
            $Media = new MediaController();
            $Media->uploadImage($_FILES["thumbnail"], 'courses', $course->id, 800, 450);
            if(isset($Media->fileUrl)) {
                $course->thumbnail_url = htmlspecialchars(strip_tags($Media->fileUrl));                
                $setClouse[] = "thumbnail_url = '{$course->thumbnail_url}'";
            }
        }

        if (isset($data['name']) && $data['name'] !== $course->name) {
            $course->name = htmlspecialchars(strip_tags($data['name']));
            $setClouse[] = "name = '{$course->name}'";
        }
        if (isset($data['slug']) && $data['slug'] !== $course->slug) {
            $course->slug = htmlspecialchars(strip_tags($data['slug']));
            $setClouse[] = "slug = '{$course->slug}'";
        }
        if (isset($data['description']) && $data['description'] !== $course->description) {
            $course->description = htmlspecialchars(strip_tags($data['description']));
            $setClouse[] = "description = '{$course->description}'";
        }
        if (isset($data['category']) && $data['category'] !== $course->category) {
            $course->category = htmlspecialchars(strip_tags($data['category']));
            $setClouse[] = "category = '{$course->category}'";
        }
        if (isset($data['keywords']) && $data['keywords'] !== $course->keywords) {
            $course->keywords = htmlspecialchars(strip_tags($data['keywords']));
            $setClouse[] = "keywords = '{$course->keywords}'";
        }
        $course->create_date = date('Y-m-d H:i:s');
        $course->create_uid = $UserPermmited->id;

        if (empty($setClouse)) {
            http_response_code(400);
            echo json_encode(array("message" => "No hay datos para actualizar"));
            return;
        }

        if ($course->update($setClouse)) {
            http_response_code(200);
            echo json_encode(array(
                "message" => "Curso actualizado",
                "id" => intval($course->id),
                "name" => $course->name,
                "slug" => $course->slug,
            ));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "No se puede actualizar el curso"));
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
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        if (isset($_GET['category'])){
            $Category->getOne($_GET['category']);
        }
        $search = isset($_GET['search']) ? $_GET['search'] : null;

        if ($Category->id) {
            $args[] = "category = '{$Category->id}'";
        }

        if ($search) {
            $args[] = "name LIKE '%{$search}%' OR keywords LIKE '%{$search}%'";
        }
        
        $records_per_page = isset($_GET['limit']) ? $_GET['limit'] : 20;
        $courses = $course->getMany($args, $page, $records_per_page);
        if ($Category->name){
            $courses['category'] = $Category;
        }
        $courses['canCreate'] = $UserPermmited->role == "admin" || $UserPermmited->role == "teacher" ? true : false;
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
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $Category->getOne($slug);
        if (!$Category->id) {
            http_response_code(404);
            echo json_encode(array("message" => "Categoría no encontrada"));
            return;
        }
        $search = isset($_GET['search']) ? $_GET['search'] : null;
        
        if ($search) {
            $args[] = "name LIKE '%{$search}%' OR keywords LIKE '%{$search}%'";
        }

        $records_per_page = isset($_GET['limit']) ? $_GET['limit'] : 20;
        $courses = $course->getManyByCategory($Category->id, $args, $page, $records_per_page);
        $courses['canCreate'] = $UserPermmited->role == "admin" || $UserPermmited->role == "teacher" ? true : false;
        if ($Category->name){
            $courses['category'] = array(
                'id' => $Category->id,
                'name' => $Category->name,
                'slug' => $Category->slug,
                'description' => $Category->description,
                'image' => $Category->image_url,
            );
        }
        if ($courses) {
            http_response_code(200);
            echo json_encode($courses);
            return;
        } else {
            http_response_code(204);
            echo json_encode(array("message" => "No se encontraron cursos"));
            return;
        }
    }

    public function getOne($slug)
    {
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher','student');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }
        
        try {
            $course = new CourseModel();
            $slugArray = explode("-", $slug);
            $courseId = end($slugArray);
            $course->id = $courseId;

            if ($course->getOne($courseId)) {
                $CreateUid = new UserModel();
                $CreateUid->getOne($course->create_uid);
                $Category = new CategoryModel();
                $Category->getOneById($course->category);
                $CourseContent = new CourseContentModel();
                $CourseContent->course = $course->id;
                $course->courseContents = $CourseContent->getMany();
                http_response_code(200);
                echo json_encode(array(
                    "id" => intval($course->id),
                    "name" => $course->name,
                    "slug" => $course->slug."-".$course->id,
                    "description" => $course->description,
                    "category_id" => $course->category,
                    "category" => !is_null($Category->id) ? array(
                        'id' => $Category->id,
                        'name' => $Category->name,
                        'slug' => $Category->slug,
                    ) : null,
                    "keywords" => $course->keywords,
                    "courseContents" => $course->courseContents,
                    "create_date" => $course->create_date,
                    "create_uid" => !is_null($CreateUid->id) ? array(
                        'id' => $CreateUid->id,
                        'name' => $CreateUid->display_name,
                        'firstname' => $CreateUid->firstname,
                        'lastname' => $CreateUid->lastname,
                        'image' => $CreateUid->avatar_url,
                    ) : null,
                    "thumbnail" => $course->thumbnail_url,
                    "canEdit" => $UserPermmited->id == $course->create_uid || $UserPermmited->role == "admin" ? true : false,
                ));
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

    public function delete($id)
    {
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }
        $course = new CourseModel();
        $course->id = $id;
        $course->getOne($id);
        if (!$course->create_uid == $UserPermmited->id && $UserPermmited->role != "admin") {
            http_response_code(403);
            echo json_encode(array("message" => "No se le permite eliminar este curso"));
            return;
        }
        if ($course->delete($id)) {
            http_response_code(200);
            echo json_encode(array("message" => "Curso eliminado"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Curso no eliminado"));
            return;
        }
    } 
    

    public function checkIfExists($CourseId)
    {
        $course = new CourseModel();
        $course->id = $CourseId;

        if ($course->getOne($CourseId)) {
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
