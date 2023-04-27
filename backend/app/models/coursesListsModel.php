<?php

require_once 'app/config/database_23-04-2023.php';

class coursesListsModel
{
    private $conn;
    private $table_name = "courses_lists";

    public $id;
    public $name;
    public $slug;
    public $description;
    public $create_date;
    public $create_uid;
    public $thumbnail_url;

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
                    create_date=:create_date,
                    create_uid=:create_uid,
                    thumbnail_url=:thumbnail_url";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));
        $this->thumbnail_url = htmlspecialchars(strip_tags($this->thumbnail_url));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":create_date", $this->create_date);
        $stmt->bindParam(":create_uid", $this->create_uid);
        $stmt->bindParam(":thumbnail_url", $this->thumbnail_url);

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
        create_date=:create_date,
        create_uid=:create_uid,
        thumbnail_url=:thumbnail_url
    WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));
        $this->thumbnail_url = htmlspecialchars(strip_tags($this->thumbnail_url));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":create_date", $this->create_date);
        $stmt->bindParam(":create_uid", $this->create_uid);
        $stmt->bindParam(":thumbnail_url", $this->thumbnail_url);

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

        $courses = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $courses[] = $row;
        }

        return $courses;
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
            $this->create_date = $row['create_date'];
            $this->create_uid = $row['create_uid'];
            $this->thumbnail_url = $row['thumbnail_url'];

            return true;
        }

        return false;
    }
}
