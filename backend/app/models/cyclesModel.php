<?php

require_once 'app/config/database_23-04-2023.php';

class cyclesModel
{
    private $conn;
    private $table_name = "cycles";

    public $id;
    public $name;
    public $slug;
    public $description;
    public $teacher;
    public $start_date;
    public $end_date;
    public $create_date;
    public $create_uid;


    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    name=:name,
                    slug=:slug,
                    description=:description,
                    teacher=:teacher,
                    start_date=:start_date,
                    end_date=:end_date,
                    create_date=:create_date,
                    create_uid=:create_uid";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->teacher = htmlspecialchars(strip_tags($this->teacher));
        $this->start_date = htmlspecialchars(strip_tags($this->start_date));
        $this->end_date = htmlspecialchars(strip_tags($this->end_date));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));


        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":teacher", $this->teacher);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":create_date", $this->create_date);
        $stmt->bindParam(":create_uid", $this->create_uid);

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
        name=:name,
        slug=:slug,
        description=:description,
        teacher=:teacher,
        start_date=:start_date,
        end_date=:end_date,
        create_date=:create_date,
        create_uid=:create_uid
    WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->teacher = htmlspecialchars(strip_tags($this->teacher));
        $this->start_date = htmlspecialchars(strip_tags($this->start_date));
        $this->end_date = htmlspecialchars(strip_tags($this->end_date));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));


        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":teacher", $this->teacher);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":create_date", $this->create_date);
        $stmt->bindParam(":create_uid", $this->create_uid);
        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function getAll()
    {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);

        $stmt->execute();
        $cycles_arr = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $cycle_item = array(
                "id" => $id,
                "name" => $name,
                "slug" => $slug,
                "description" => $description,
                "teacher" => $teacher,
                "start_date" => $start_date,
                "end_date" => $end_date,
                "create_date" => $create_date,
                "create_uid" => $create_uid
            );

            array_push($cycles_arr, $cycle_item);
        }

        return $cycles_arr;
    }

    function getOne($id)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $id = htmlspecialchars(strip_tags($id));
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->slug = $row['slug'];
            $this->description = $row['description'];
            $this->teacher = $row['teacher'];
            $this->start_date = $row['start_date'];
            $this->end_date = $row['end_date'];
            $this->create_date = $row['create_date'];
            $this->create_uid = $row['create_uid'];

            return true;
        }

        return false;
    }
}
