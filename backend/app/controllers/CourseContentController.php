<?php

require_once 'app/controllers/CoursesController.php';
require_once 'app/models/CourseContentModel.php';
require_once 'app/models/CourseModel.php';

require_once 'app/middleware/PermissionMiddleware.php';

class CourseContentController
{
    public function create()
    {
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin', 'teacher');
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

        $CourseContent = new CourseContentModel();
        $CourseContent->id = intval($CourseContent->getLastId()) + 1;

        $course = new CoursesController();
        $course = $course->checkIfExists(intval($data['course']));

        if (!$course) {
            http_response_code(404);
            echo json_encode(array("message" => "Course not found"));
            return;
        }else{
            $CourseContent->course = intval($data['course']);
        }

        if (isset($_FILES["thumbnail"])) {
            $Media = new MediaController();
            $Media->uploadImage($_FILES["thumbnail"], 'coursescontent', $CourseContent->id, 800, 450, 'create');
            if (isset($Media->fileUrl)) {
                $CourseContent->thumbnail_url = $Media->fileUrl;
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to upload thumbnail"));
                return;
            }
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "You need to upload a thumbnail"));
            return;
        }

        if ($data['name'] !== $CourseContent->name) {
            $CourseContent->name = $data['name'];
        }
        if ($data['description'] !== $CourseContent->description) {
            $CourseContent->description = $data['description'];
        }
        if ($data['iframe'] !== $CourseContent->iframe) {
            $CourseContent->iframe = $data['iframe'];
        }

        $CourseContent->create_date = date('Y-m-d H:i:s');
        $CourseContent->create_uid = $UserPermmited->id;

        if ($CourseContent->create()) {
            http_response_code(201);
            echo json_encode(array(
                "message" => "Course was created",
                "id" => intval($CourseContent->id),
                "name" => $CourseContent->name,
                "description" => $CourseContent->description,
                "iframe" => $CourseContent->iframe,
                "create_date" => $CourseContent->create_date,
                "create_uid" => $CourseContent->create_uid,
                "thumbnail" => $CourseContent->thumbnail_url
            ));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create course"));
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

    public function getOne($id)
    {
        try {
            $PermissionMiddleware = new PermissionMiddleware();
            $allowed = array('admin', 'teacher', 'student');
            $UserPermmited = $PermissionMiddleware->handle($allowed);
            if (!$UserPermmited) {
                return;
            }

            $courseContent = new CourseContentModel();
            $courseContent->id = $id;
            if ($courseContent->getOne()) {
                $created_uid = (new UserController())->getOne($courseContent->create_uid);
                $course = new CourseModel;
                $course->id = $courseContent->course;
                $course->getOne();
                http_response_code(200);
                echo json_encode(array(
                    "id" => $courseContent->id,
                    "name" => $courseContent->name,
                    "description" => $courseContent->description,
                    "iframe" => $courseContent->iframe,
                    "thumbnail_url" => $courseContent->thumbnail_url,
                    "course" => !is_null($course->id) ? array(
                        "name" => $course->name,
                        "slug" => $course->slug . "-" . $course->id,
                    ) : null,
                    "create_date" => $courseContent->create_date,
                    "create_uid" => $created_uid,
                ));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Course content not found"));
            }
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized"));
        }
    }

    public function update()
    {
    }

    public function delete()
    {
    }

    public function getAllAttachments()
    {
    }

    public function getAllComments()
    {
    }
}
