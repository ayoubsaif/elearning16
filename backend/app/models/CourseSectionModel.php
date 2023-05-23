<?php
// Create a Model to manage course sections with name and order field to sort sections
// Path: backend\app\models\CourseSection.php

require_once 'app/models/database.php';

class CourseSectionModel
{
    private $conn;

    public $id;
    public $name;
    public $order;
    public $course_id;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    function create()
    {
        $query = "INSERT INTO course_sections
                SET
                    name=:name,
                    course_id=:course_id,
                    `order`=:order";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->course_id = htmlspecialchars(strip_tags($this->course_id));
        $this->order = htmlspecialchars(strip_tags($this->order));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":course_id", $this->course_id);
        $stmt->bindParam(":order", $this->order);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function get()
    {
        $query = "SELECT * FROM course_sections WHERE course_id = :course_id ORDER BY `order` ASC";

        $stmt = $this->conn->prepare($query);

        $this->course_id = htmlspecialchars(strip_tags($this->course_id));

        $stmt->bindParam(":course_id", $this->course_id);

        $stmt->execute();

        return $stmt;
    }

    function update()
    {
        $query = "UPDATE course_sections
                SET
                    name=:name,
                    `order`=:order
                WHERE
                    id=:id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->order = htmlspecialchars(strip_tags($this->order));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":order", $this->order);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function delete()
    {
        $query = "DELETE FROM course_sections WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function deleteByCourseId()
    {
        $query = "DELETE FROM course_sections WHERE course_id = :course_id";

        $stmt = $this->conn->prepare($query);

        $this->course_id = htmlspecialchars(strip_tags($this->course_id));

        $stmt->bindParam(":course_id", $this->course_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function getOne()
    {
        $query = "SELECT * FROM course_sections WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":id", $this->id);

        $stmt->execute();

        return $stmt;
    }

    function getOneByCourseId()
    {
        $query = "SELECT * FROM course_sections WHERE course_id = :course_id AND `order` = :order";

        $stmt = $this->conn->prepare($query);

        $this->course_id = htmlspecialchars(strip_tags($this->course_id));
        $this->order = htmlspecialchars(strip_tags($this->order));

        $stmt->bindParam(":course_id", $this->course_id);
        $stmt->bindParam(":order", $this->order);

        $stmt->execute();

        return $stmt;
    }

    function updateOrder()
    {
        $query = "UPDATE course_sections
                SET
                    `order`=:order
                WHERE
                    id=:id";

        $stmt = $this->conn->prepare($query);

        $this->order = htmlspecialchars(strip_tags($this->order));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":order", $this->order);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}
