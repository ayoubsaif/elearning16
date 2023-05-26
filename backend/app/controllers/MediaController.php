<?php

require_once 'app/models/MediaModel.php';

class MediaController
{
    private $mediaModel;
    public $filename;
    public $model;
    public $model_id;
    public $fileUrl;

    public function __construct()
    {
        $this->mediaModel = new MediaModel();
    }

    public function uploadMedia($file)
    {
        // Validate file type and size
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4'];
        $maxSize = 10 * 1024 * 1024; // 10MB

        if ($file['error'] === UPLOAD_ERR_OK) {
            $fileName = $file['name'];
            $fileTempPath = $file['tmp_name'];
            $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);

            if (in_array($fileExtension, $allowedExtensions) && $file['size'] <= $maxSize) {
                // Generate a unique filename
                $uniqueFileName = uniqid() . '.' . $fileExtension;

                // Move the uploaded file to the desired directory
                $destination = './uploads/' . $uniqueFileName;
                move_uploaded_file($fileTempPath, $destination);

                // Save the file details in the database
                $this->mediaModel->uploadMedia($uniqueFileName, $destination, $fileExtension);

                return 'File uploaded successfully!';
            } else {
                return 'Invalid file type or size exceeds the limit.';
            }
        } else {
            return 'Error uploading the file.';
        }
    }

    public function uploadImage($file, $model_name, $model_id, $heigth = 500, $width = 500, $method = "create")
    {
        $imageFile = $file["tmp_name"];
        $this->mediaModel->filename = uniqid() . '_' . $file["name"];
        $this->mediaModel->model = $model_name;
        $this->mediaModel->model_id = $model_id;

        $target_dir = "uploads/".$model_name;
        $this->mediaModel->filepath = $target_dir . '/' . $this->mediaModel->filename;
        $this->mediaModel->filetype = strtolower(pathinfo($this->mediaModel->filepath, PATHINFO_EXTENSION));

        if (getimagesize($imageFile) === false) {
            http_response_code(503);
            echo json_encode(array("message" => "File is not an image."));
            return;
        }

        if ($file["size"] > 500000) {
            http_response_code(503);
            echo json_encode(array("message" => "Sorry, your file is too large."));
            return;
        }

        if ($this->mediaModel->filetype != "jpg" && $this->mediaModel->filetype != "jpeg" && $this->mediaModel->filetype != "png") {
            http_response_code(503);
            echo json_encode(array("message" => "Sorry, only JPG, JPEG, PNG files are allowed."));
            return;
        }

        // Create a resized image
        $resizedImage = imagecreatetruecolor($heigth, $width);
        if ($this->mediaModel->filetype == "jpg" || $this->mediaModel->filetype == "jpeg") {
            $originalImage = imagecreatefromjpeg($imageFile);
        } elseif ($this->mediaModel->filetype == "png") {
            $originalImage = imagecreatefrompng($imageFile);
        }

        // Resize the original image to the new dimensions
        imagecopyresampled($resizedImage, $originalImage, 0, 0, 0, 0, $heigth, $width, imagesx($originalImage), imagesy($originalImage));

        if (!imagejpeg($resizedImage, $this->mediaModel->filepath)) {
            http_response_code(503);
            echo json_encode(array("message" => "Sorry, there was an error uploading your file."));
            return;
        }
        imagedestroy($originalImage);
        imagedestroy($resizedImage);

        if ($method == "update") {
            $this->mediaModel->removeMedia($this->mediaModel->model, $this->mediaModel->model_id);
        }
        // check if there a file in directory before remove
        $oldFilename = $this->mediaModel->getOneByModel($this->mediaModel->model, $this->mediaModel->model_id);

        if (!getimagesize($imageFile) === false && $oldFilename != null) {
            unlink($oldFilename['filepath']);
        }

        if ($this->mediaModel->uploadMedia()) {
            $this->fileUrl = getenv("HOST") . $this->mediaModel->filepath;
            return true;
        }
    }

    public function getAllMedia()
    {
        return $this->mediaModel->getAllMedia();
    }
}
