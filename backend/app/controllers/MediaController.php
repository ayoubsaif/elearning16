<?php

class MediaController
{
    private $mediaModel;

    public function __construct(Media $mediaModel)
    {
        $this->mediaModel = $mediaModel;
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

    public function getAllMedia()
    {
        return $this->mediaModel->getAllMedia();
    }
}
