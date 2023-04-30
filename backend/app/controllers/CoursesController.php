<?php

require_once 'app/models/CourseModel.php';
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

        $course = new CourseModel();
        $course->name = $data->name;
        $course->slug = $data->slug;
        $course->description = $data->description;
        $course->category = $data->category;
        $course->teacher = $data->teacher;
        $course->keywords = implode(",", $data->keywords);
        $course->create_date = date('Y-m-d H:i:s');
        $course->create_uid = $UserPermmited->id;
        $course->thumbnail_url = $data->thumbnail_url;

        if ($course->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "Course was created."));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create course."));
            return;
        }
    }


    public function getAll()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {

            $course = new CourseModel();

            if (isset($_GET['offset']) && isset($_GET['limit'])) {
                $from_record_num = $_GET['offset'];
                $records_per_page = $_GET['limit'];
            } else {
                $from_record_num = 0;
                $records_per_page = 10;
            }
            $courses = $course->getAll($from_record_num, $records_per_page);

            if ($courses) {
                http_response_code(200);
                echo json_encode($courses);
                return;
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "No courses found."));
                return;
            }
        }
    }

    public function getOne()
    {
        try {
            $course = new CourseModel();
            $slug = $_GET['slug'];
            $slugArray = explode("-", $slug);
            $courseId = end($slugArray);
            $course->id = $courseId;

            if ($course->getOne()) {
                http_response_code(200);
                $returnArray = array(
                    "name" => $course->name,
                    "description" => $course->description,
                    "teacher" => $course->teacher,
                    "category" => $course->category,
                    "keywords" => $course->keywords,
                    "create_date" => $course->create_date,
                    "create_uid" => $course->create_uid,
                    "thumbnail_url" => $course->thumbnail_url
                );
                echo json_encode($returnArray);
                return;
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Course not found."));
                return;
            }
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode(array("message" => "Course not found."));
            return;
        }
    }
}
