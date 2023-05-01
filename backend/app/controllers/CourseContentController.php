<?php

require_once 'app/controllers/CoursesController.php';
require_once 'app/models/CourseContentModel.php';
require_once 'app/middleware/PermissionMiddleware.php';

class CourseContentController
{
    public function create(){
        $data = json_decode(file_get_contents("php://input"));

        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher');

        $UserPermmited = $PermissionMiddleware->handle($allowed);

        if (!$UserPermmited) {
            return;
        }

        $course = new CoursesController();
        $course = $course->checkIfExists($data->course);

        if (!$course) {
            http_response_code(404);
            echo json_encode(array("message" => "Course not found"));
            return;
        }

        $courseContent = new CourseContentModel();
        $courseContent->name = $data->name;
        $courseContent->description = $data->description;
        $courseContent->iframe = $data->iframe;
        $courseContent->thumbnail_url = $data->thumbnail_url;
        $courseContent->course = $data->course;
        $courseContent->create_date = date('Y-m-d H:i:s');
        $courseContent->create_uid = $UserPermmited->id;

        if ($courseContent->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "Course content was created"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create course content"));
            return;
        }

    }

    public function getAll()
    {
        $courseContent = new CourseContentModel();

        if (isset($_GET['offset']) && isset($_GET['limit'])) {
            $from_record_num = $_GET['offset'];
            $records_per_page = $_GET['limit'];
        } else {
            $from_record_num = 0;
            $records_per_page = 10;
        }
        if (isset($_GET['course'])) {
            $courseContent->course = $_GET['course'];
        }
        $courseContents = $courseContent->getAll($from_record_num, $records_per_page);

        if ($courseContents) {
            http_response_code(200);
            echo json_encode($courseContents);
            return;
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No course content found"));
            return;
        }
    }

    public function getOne(){

    }

    public function update(){

    }

    public function delete(){

    }

    public function getAllAttachments(){

    }

    public function getAllComments(){

    }

}

