<?php
    
require_once 'app/models/AttachmentModel.php';
require_once 'app/middleware/PermissionMiddleware.php';

class AttachmentsController
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

        $attachment = new AttachmentModel();
        $attachment->name = $data->name;
        $attachment->fileUrl = $data->fileUrl;
        $attachment->courseContent = $data->courseContent;
        $attachment->create_date = date('Y-m-d H:i:s');
        $attachment->create_uid = $UserPermmited->id;

        if ($attachment->create()) {
            http_response_code(201);
            echo json_encode(array("message" => "Attachment was created"));
            return;
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create attachment"));
            return;
        }
    }

    public function getAll($courseContentId)
    {
        $attachment = new AttachmentModel();
        $attachment->courseContent = $courseContentId;

        if (isset($_GET['offset']) && isset($_GET['limit'])) {
            $from_record_num = $_GET['offset'];
            $records_per_page = $_GET['limit'];
        } else {
            $from_record_num = 0;
            $records_per_page = 10;
        }
        $attachments = $attachment->getAll($from_record_num, $records_per_page);

        if ($attachments) {
            http_response_code(200);
            echo json_encode($attachments);
            return;
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No attachments found"));
            return;
        }
    }

    public function getOne($id)
    {
        $PermissionMiddleware = new PermissionMiddleware();
        $allowed = array('admin','teacher');
        $UserPermmited = $PermissionMiddleware->handle($allowed);

        if (!$UserPermmited) {
            return;
        }

        $Attachment = new AttachmentModel();
        $Attachment->id = $id;
        echo json_encode(array("message" => $id));

        if ($Attachment->getOne()) {
            http_response_code(200);
            echo json_encode($Attachment);
            return;
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No attachment found"));
            return;
        }
    }


}
