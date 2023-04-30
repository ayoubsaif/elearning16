<?php

require_once 'app/models/CourseModel.php';
require_once 'vendor/firebase/php-jwt/src/JWT.php';

use Firebase\JWT\JWT;

class CoursesController {
    public function getAll() {
        if($_SERVER['REQUEST_METHOD'] == 'GET') {
            
            $course = new CourseModel();
            
            if (isset($_GET['from_record_num']) && isset($_GET['records_per_page'])) {
                $from_record_num = $_GET['from_record_num'];
                $records_per_page = $_GET['records_per_page'];
            }else{
                $from_record_num = 0;
                $records_per_page = 10;
            }
            $courses = $course->getAll($from_record_num, $records_per_page);

            if ($courses) {
                http_response_code(200);
                echo json_encode($courses);
                return;
            }else{
                http_response_code(404);
                echo json_encode(array("message" => "No courses found."));
                return;
            }
        }
    }

    public function getOne() {
        if($_SERVER['REQUEST_METHOD'] == 'GET') {
            $course = new CourseModel();
            $slug = $_GET['slug'];
            $course->slug = $slug;

            if ($course->getOne()) {
                http_response_code(200);
                $returnArray = array(
                    "name" => $course->name,
                    "description" => $course->description,
                    "teacher" => $course->teacher,
                    "category" => $course->category,
                    "create_date" => $course->create_date,
                    "create_uid" => $course->create_uid,
                    "thumbnail_url" => $course->thumbnail_url
                );
                echo json_encode($returnArray);
                return;
            }else{
                http_response_code(404);
                echo json_encode(array("message" => "Course not found."));
                return;
            }
        }
    }
}