<?php
// Course Section Controller to handle API requests

require_once 'app/models/CourseSectionModel.php';
require_once 'app/middlewares/PermissionMiddleware.php';

class CourseSectionController
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

        $courseSection = new CourseSectionModel();
        $courseSection->name = $data->name;
        $courseSection->course_id = $data->course_id;
        $courseSection->order = $data->order;

        if ($courseSection->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "Course Section was created"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create course section"));
            return;
        }
    }
    
    public function get()
    {
        $data = json_decode(file_get_contents("php://input"));
        
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher','student');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }

        $courseSection = new CourseSectionModel();
        $courseSection->course_id = $data->course_id;
        $courseSections = $courseSection->get();
        if ($courseSections) {
            http_response_code(200);
            echo json_encode($courseSections);
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to get course sections"));
            return;
        }
    }

    public function update()
    {
        $data = json_decode(file_get_contents("php://input"));
        
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }

        $courseSection = new CourseSectionModel();
        $courseSection->id = $data->id;
        $courseSection->name = $data->name;
        $courseSection->course_id = $data->course_id;
        $courseSection->order = $data->order;

        if ($courseSection->update()) {
            http_response_code(200);
            echo json_encode(array("message" => "Course Section was updated"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update course section"));
            return;
        }
    }

    public function delete()
    {
        $data = json_decode(file_get_contents("php://input"));
        
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }

        $courseSection = new CourseSectionModel();
        $courseSection->id = $data->id;

        if ($courseSection->delete()) {
            http_response_code(200);
            echo json_encode(array("message" => "Course Section was deleted"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to delete course section"));
            return;
        }
    }

    public function updateOrder()
    {
        $data = json_decode(file_get_contents("php://input"));
        
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher');
        $UserPermmited = $PermissionMiddleware->handle($allowed);
        if (!$UserPermmited) {
            return;
        }

        $courseSection = new CourseSectionModel();
        $courseSection->id = $data->id;
        $courseSection->getOne();
        $courseSection->order = $data->order;

        if ($courseSection->updateOrder()) {
            http_response_code(200);
            echo json_encode(array("message" => "Course Section order was updated"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to update course section order"));
            return;
        }
    }

}