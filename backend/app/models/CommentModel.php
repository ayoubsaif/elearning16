<?php

require_once 'app/config/database.php';

class CommentModel
{
    private $conn;

    public $id;
    public $course_content;
    public $user;
    public $parent_comment;
    public $create_date;
    public $create_uid;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    function create()
    {
        $query = "INSERT INTO comments
                SET
                    course_content=:course_content,
                    user=:user,
                    parent_comment=:parent_comment,
                    create_date=:create_date,
                    create_uid=:create_uid";

        $stmt = $this->conn->prepare($query);

        $this->course_content = htmlspecialchars(strip_tags($this->course_content));
        $this->user = htmlspecialchars(strip_tags($this->user));
        $this->parent_comment = htmlspecialchars(strip_tags($this->parent_comment));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));

        $stmt->bindParam(":course_content", $this->course_content);
        $stmt->bindParam(":user", $this->user);
        $stmt->bindParam(":parent_comment", $this->parent_comment);
        $stmt->bindParam(":create_date", $this->create_date);
        $stmt->bindParam(":create_uid", $this->create_uid);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }


    function delete($id)
    {
        $query = "DELETE FROM comments WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $id = htmlspecialchars(strip_tags($id));
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function update()
    {
        $query = "UPDATE comments
            SET
            course_content=:course_content,
            user=:user,
            parent_comment=:parent_comment,
            create_date=:create_date,
            create_uid=:create_uid
            WHERE
                id=:id";

        $stmt = $this->conn->prepare($query);

        $this->course_content = htmlspecialchars(strip_tags($this->course_content));
        $this->user = htmlspecialchars(strip_tags($this->user));
        $this->parent_comment = htmlspecialchars(strip_tags($this->parent_comment));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));

        $stmt->bindParam(":course_content", $this->course_content);
        $stmt->bindParam(":user", $this->user);
        $stmt->bindParam(":parent_comment", $this->parent_comment);
        $stmt->bindParam(":create_date", $this->create_date);
        $stmt->bindParam(":create_uid", $this->create_uid);


        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function getAll()
    {
        $query = "SELECT * FROM comments";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $comments = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $comment_item = array(
                "id" => $id,
                "course_content" => $course_content,
                "user" => $user,
                "parent_comment" => $parent_comment,
                "create_date" => $create_date,
                "create_uid" => $create_uid
            );

            array_push($comments, $comment_item);
        }

        return $comments;
    }

    function getAllByCourseContent() {
        $query = "SELECT * FROM comments WHERE course_content = :course_content";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":course_content", $this->course_content);

        $stmt->execute();

        $comments = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $comment_item = array(
                "id" => $id,
                "course_content" => $course_content,
                "user" => $user,
                "parent_comment" => $parent_comment,
                "create_date" => $create_date,
                "create_uid" => $create_uid
            );

            array_push($comments, $comment_item);
        }

        return $comments;
    }
}
