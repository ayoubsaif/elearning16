<?php

require_once 'app/config/database.php';
require_once 'app/models/CommentModel.php';

require_once 'app/models/ContentProgressModel.php';

class CourseContentModel
{
    private $conn;

    public $id;
    public $name;
    public $description;
    public $iframe;
    public $thumbnail_url;
    public $course;
    public $comments;
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
                    description=:description,
                    iframe=:iframe,
                    thumbnail_url=:thumbnail_url,
                    course=:course,
                    create_date=:create_date,
                    create_uid=:create_uid";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->iframe = htmlspecialchars(strip_tags($this->iframe));
        $this->thumbnail_url = htmlspecialchars(strip_tags($this->thumbnail_url));
        $this->course = htmlspecialchars(strip_tags($this->course));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));

        $stmt->bindParam(":name", $this->name);
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
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->iframe = htmlspecialchars(strip_tags($this->iframe));
        $this->thumbnail_url = htmlspecialchars(strip_tags($this->thumbnail_url));
        $this->course = htmlspecialchars(strip_tags($this->course));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));

        $stmt->bindParam(":name", $this->name);
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

    function getAll($from_record_num = 0, $records_per_page = 10)
    {
        $query = "SELECT * 
            FROM course_content
            WHERE course = ?
            ORDER BY id DESC
            LIMIT ?, ?";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(1, $this->course, PDO::PARAM_INT);
        $stmt->bindParam(2, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(3, $records_per_page, PDO::PARAM_INT);
        $stmt->execute();

        $courses_arr = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $ContentProgress = new ContentProgressModel();
            $ContentProgress->user = $_SESSION['user'];
            $ContentProgress->content = intval($id);
            $ContentProgress->getOne();

            $course_item = array(
                "id" => $id,
                "name" => $name,
                "description" => $description,
                "thumbnail_url" => $thumbnail_url,
                "create_date" => $create_date,
                "played" => $ContentProgress->played,
                "progress" => $ContentProgress->progress,
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
            $this->description = $course['description'];
            $this->iframe = $course['iframe'];
            $this->thumbnail_url = $course['thumbnail_url'];
            $this->course = intval($course['course']);
            $this->comments = (new CommentModel())->getAllByCourseContent($this->id);
            $this->create_date = $course['create_date'];
            $this->create_uid = $course['create_uid'];

            return true;
        }

        return false;
    }

    function getLastId()
    {
        $query = "SELECT id FROM course_content ORDER BY id DESC LIMIT 0,1";
        $stmt = $this->conn->prepare($query);

        if ($stmt->execute()) {
            $course = $stmt->fetch(PDO::FETCH_ASSOC);
            return intval($course['id']);
        }

        return false;
    }
}
