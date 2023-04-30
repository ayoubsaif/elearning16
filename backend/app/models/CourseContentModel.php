<?php

require_once 'app/config/database_23-04-2023.php';

class CourseContentModel
{
    private $conn;
    private $table_name = "courses";

    public $id;
    public $name;
    public $slug;
    public $description;
    public $iframe;
    public $thumbnail_url;
    public $course;
    public $create_date;
    public $create_uid;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    function create()
    {
        $query = "INSERT INTO course_content
                SET
                    name=:name,
                    slug=:slug,
                    description=:description,
                    iframe=:iframe,
                    thumbnail_url=:thumbnail_url,
                    course=:course,
                    create_date=:create_date,
                    create_uid=:create_uid";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->iframe = htmlspecialchars(strip_tags($this->iframe));
        $this->thumbnail_url = htmlspecialchars(strip_tags($this->thumbnail_url));
        $this->course = htmlspecialchars(strip_tags($this->course));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":iframe", $this->iframe);
        $stmt->bindParam(":thumbnail_url", $this->thumbnail_url);
        $stmt->bindParam(":course", $this->course);
        $stmt->bindParam(":create_date", $this->create_date);
        $stmt->bindParam(":create_uid", $this->create_uid);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }


    function delete($id)
    {
        $query = "DELETE FROM course_content WHERE id = :id";
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
        $query = "UPDATE course_content
            SET
            name=:name,
            slug=:slug,
            description=:description,
            iframe=:iframe,
            thumbnail_url=:thumbnail_url,
            course=:course,
            create_date=:create_date,
            create_uid=:create_uid
            WHERE
                id=:id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->iframe = htmlspecialchars(strip_tags($this->iframe));
        $this->thumbnail_url = htmlspecialchars(strip_tags($this->thumbnail_url));
        $this->course = htmlspecialchars(strip_tags($this->course));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":iframe", $this->iframe);
        $stmt->bindParam(":thumbnail_url", $this->thumbnail_url);
        $stmt->bindParam(":course", $this->course);
        $stmt->bindParam(":create_date", $this->create_date);
        $stmt->bindParam(":create_uid", $this->create_uid);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function getAll()
    {
        $query = "SELECT * FROM course_content";

        $stmt = $this->conn->prepare($query);

        $stmt->execute();

        $courses_arr = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $course_item = array(
                "id" => $id,
                "name" => $name,
                "slug" => $slug,
                "description" => $description,
                "iframe" => $iframe,
                "thumbnail_url" => $thumbnail_url,
                "course" => $course,
                "create_date" => $create_date,
                "create_uid" => $create_uid
            );

            array_push($courses_arr, $course_item);
        }

        return $courses_arr;
    }


    function getOne()
    {
        $query = "SELECT * FROM course_content WHERE id = :id LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            $course = $stmt->fetch(PDO::FETCH_ASSOC);

            $this->id = $course['id'];
            $this->name = $course['name'];
            $this->slug = $course['slug'];
            $this->description = $course['description'];
            $this->iframe = $course['iframe'];
            $this->thumbnail_url = $course['thumbnail_url'];
            $this->course = $course['course'];
            $this->create_date = $course['create_date'];
            $this->create_uid = $course['create_uid'];

            return true;
        }

        return false;
    }
}
