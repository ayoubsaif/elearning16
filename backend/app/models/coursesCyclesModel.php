<?php

require_once 'app/config/database_23-04-2023.php';

class coursesCyclesModel
{
    private $conn;
    private $table_name = "courses_cycles";

    public $id;
    public $course;
    public $cycle;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    course=:course,
                    cycle=:cycle";

        $stmt = $this->conn->prepare($query);

        $this->course = htmlspecialchars(strip_tags($this->course));
        $this->cycle = htmlspecialchars(strip_tags($this->cycle));

        $stmt->bindParam(":course", $this->course);
        $stmt->bindParam(":cycle", $this->cycle);


        if ($stmt->execute()) {
            return true;
        }

        return false;
    }


    function delete($id)
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
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
        $query = "UPDATE " . $this->table_name . "
            SET
            course=:course,
            cycle=:cycle
            WHERE
                id=:id";

        $stmt = $this->conn->prepare($query);

        $this->course = htmlspecialchars(strip_tags($this->course));
        $this->cycle = htmlspecialchars(strip_tags($this->cycle));

        $stmt->bindParam(":course", $this->course);
        $stmt->bindParam(":cycle", $this->cycle);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}