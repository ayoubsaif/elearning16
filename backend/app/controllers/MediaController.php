<?php

require_once 'app/models/MediaModel.php';

class MediaController
{
    private $mediaModel;

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

    public function uploadAvatar($FILE, $user_id)
    {
        $imageFile = $FILE["tmp_name"];
        $this->mediaModel->filename = uniqid().'_'.$FILE["name"];
        $this->mediaModel->model = 'user';
        $this->mediaModel->model_id = $user_id;

        $target_dir = "uploads/avatar";
        $this->mediaModel->filepath = $target_dir . '/' . $this->mediaModel->filename;
        $this->mediaModel->filetype = strtolower(pathinfo($this->mediaModel->filepath, PATHINFO_EXTENSION));

        if (getimagesize($imageFile) === false) {
            http_response_code(503);
            echo json_encode(array("message" => "File is not an image."));
            return;
        }

        if ($FILE["size"] > 500000) {
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
        $resizedImage = imagecreatetruecolor(500, 500);
        if ($this->mediaModel->filetype == "jpg" || $this->mediaModel->filetype == "jpeg") {
            $originalImage = imagecreatefromjpeg($imageFile);
        } elseif ($this->mediaModel->filetype == "png") {
            $originalImage = imagecreatefrompng($imageFile);
        }

        // Resize the original image to the new dimensions
        imagecopyresampled($resizedImage, $originalImage, 0, 0, 0, 0, 500, 500, imagesx($originalImage), imagesy($originalImage));

        if (!imagejpeg($resizedImage, $this->mediaModel->filepath)) {
            http_response_code(503);
            echo json_encode(array("message" => "Sorry, there was an error uploading your file."));
            return;
        }
        imagedestroy($originalImage);
        imagedestroy($resizedImage);

        // check if there a file in directory before remove
        $oldFilename = $this->mediaModel->getOneByModel('user', $user_id)['filepath'];
               
        if (!getimagesize($imageFile) === false && $oldFilename != null) {
            unlink($oldFilename);
        }

        if ($this->mediaModel->uploadMedia())
        {   
            return getenv("HOST").$this->mediaModel->filepath;
        }

    }

    public function getAllMedia()
    {
        return $this->mediaModel->getAllMedia();
    }
}
