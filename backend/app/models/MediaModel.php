<?php

require_once 'app/config/database.php';
require_once 'app/middleware/PermissionMiddleware.php';

class MediaModel
{
    private $conn;

    public $model;
    public $model_id;
    public $filename;
    public $filepath;
    public $filetype;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    public function uploadMedia()
    {
        $query = "INSERT INTO media
                SET
                    model=:model,
                    model_id=:model_id,
                    filename=:filename,
                    filepath=:filepath,
                    filetype=:filetype";

        $stmt = $this->conn->prepare($query);

        $this->model = htmlspecialchars(strip_tags($this->model));
        $this->model_id = intval(htmlspecialchars(strip_tags($this->model_id)));
        $this->filename = htmlspecialchars(strip_tags($this->filename));
        $this->filepath = htmlspecialchars(strip_tags($this->filepath));
        $this->filetype = htmlspecialchars(strip_tags($this->filetype));

        $stmt->bindParam(":model", $this->model);
        $stmt->bindParam(":model_id", $this->model_id);
        $stmt->bindParam(":filename", $this->filename);
        $stmt->bindParam(":filepath", $this->filepath);
        $stmt->bindParam(":filetype", $this->filetype);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function removeMedia($model, $model_id)
    {
        $query = "DELETE FROM media WHERE model = :model AND model_id = :id";

        $stmt = $this->conn->prepare($query);
        
        $this->model = htmlspecialchars(strip_tags($model));
        $this->model_id = intval(htmlspecialchars(strip_tags($model_id)));

        $stmt->bindParam(":model", $this->model);
        $stmt->bindParam(":id", $this->model_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function getOneByModel($model, $model_id)
    {
        $query = "SELECT * FROM media WHERE model=:model AND model_id=:id ORDER BY ID DESC LIMIT 1";

        $stmt = $this->conn->prepare($query);
        
        $this->model = htmlspecialchars(strip_tags($model));
        $this->model_id = intval(htmlspecialchars(strip_tags($model_id)));

        $stmt->bindParam(":model", $this->model);
        $stmt->bindParam(":id", $this->model_id);

        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($data) {
            return $data;
        }
        return false;
    }

    public function getAllMedia()
    {
        $stmt = $this->conn->query("SELECT * FROM media");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
