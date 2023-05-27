<?php

require_once 'app/config/database.php';
require_once 'app/models/CommentModel.php';

class ContentProgressModel
{
    private $conn;

    public $content;
    public $user;

    public $played;
    public $progress;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    public function create()
    {
        $query = "INSERT INTO content_progress
                SET
                    content=:content,
                    user=:user,
                    played=:played,
                    progress=:progress";

        $stmt = $this->conn->prepare($query);

        $this->content = intval(htmlspecialchars(strip_tags($this->content)));
        $this->user = intval(htmlspecialchars(strip_tags($this->user)));
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":user", $this->user);

        $this->played = floatval(htmlspecialchars(strip_tags($this->played)));
        $this->progress = floatval(htmlspecialchars(strip_tags($this->progress)));
        $stmt->bindParam(":played", $this->played);
        $stmt->bindParam(":progress", $this->progress);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function update()
    {
        $query = "UPDATE content_progress
                SET
                    played=:played,
                    progress=:progress
                WHERE 
                    content=:content AND
                    user=:user";

        $stmt = $this->conn->prepare($query);

        $this->content = intval(htmlspecialchars(strip_tags($this->content)));
        $this->user = intval(htmlspecialchars(strip_tags($this->user)));
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":user", $this->user);

        $this->played = floatval(htmlspecialchars(strip_tags($this->played)));
        $this->progress = floatval(htmlspecialchars(strip_tags($this->progress)));
        $stmt->bindParam(":played", $this->played);
        $stmt->bindParam(":progress", $this->progress);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    public function checkIfExists()
    {
        $query = "SELECT * 
                    FROM content_progress 
                    WHERE content=:content AND user=:user";
    
        $stmt = $this->conn->prepare($query);
    
        $this->content = intval(htmlspecialchars(strip_tags($this->content)));
        $this->user = intval(htmlspecialchars(strip_tags($this->user)));
    
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":user", $this->user);
    
        $stmt->execute();
    
        $num = $stmt->rowCount();
    
        if ($num > 0) {
            return true;
        }
    
        return false;
    }

    public function getOne()
    {
        $query = "SELECT * 
                    FROM content_progress 
                    WHERE content=:content AND user=:user";
    
        $stmt = $this->conn->prepare($query);
    
        $this->content = intval(htmlspecialchars(strip_tags($this->content)));
        $this->user = intval(htmlspecialchars(strip_tags($this->user)));
    
        $stmt->bindParam(":content", $this->content);
        $stmt->bindParam(":user", $this->user);
    
        $stmt->execute();
    
        $num = $stmt->rowCount();
    
        if ($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->played = floatval($row['played']);
            $this->progress = floatval($row['progress']);
            return true;
        }
    
        return false;
    }
}
