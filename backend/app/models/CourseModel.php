<?php

require_once 'app/config/database.php';
require_once 'app/models/UserModel.php';
require_once 'app/models/CategoryModel.php';

class CourseModel
{
    private $conn;

    public $id;
    public $name;
    public $slug;
    public $description;
    public $teacher;
    public $category;
    public $create_date;
    public $create_uid;
    public $thumbnail_url;
    public $keywords;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    function create()
    {
        $query = "INSERT INTO courses
                SET
                    name=:name,
                    slug=:slug,
                    description=:description,
                    category=:category,
                    teacher=:teacher,
                    keywords=:keywords,
                    create_date=:create_date,
                    create_uid=:create_uid,
                    thumbnail_url=:thumbnail_url";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->teacher = htmlspecialchars(strip_tags($this->teacher));
        $this->keywords = htmlspecialchars(strip_tags($this->keywords));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));
        $this->thumbnail_url = htmlspecialchars(strip_tags($this->thumbnail_url));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":teacher", $this->teacher);
        $stmt->bindParam(":keywords", $this->keywords);
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
        $query = "DELETE FROM courses WHERE id = :id";
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
        $query = "UPDATE courses
            SET
                name=:name,
                slug=:slug,
                description=:description,
                category=:category,
                teacher=:teacher,
                keywords=:keywords,
                create_date=:create_date,
                create_uid=:create_uid,
                thumbnail_url=:thumbnail_url
            WHERE id=:id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->teacher = htmlspecialchars(strip_tags($this->teacher));
        $this->keywords = htmlspecialchars(strip_tags($this->keywords));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));
        $this->thumbnail_url = htmlspecialchars(strip_tags($this->thumbnail_url));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":teacher", $this->teacher);
        $stmt->bindParam(":keywords", $this->keywords);
        $stmt->bindParam(":create_date", $this->create_date);
        $stmt->bindParam(":create_uid", $this->create_uid);
        $stmt->bindParam(":thumbnail_url", $this->thumbnail_url);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    # Read all courses, query limit and offset
    function getAll($from_record_num = 0, $records_per_page = 10)
    {
        $query = "SELECT id, name, thumbnail_url, slug 
            FROM courses ORDER BY create_date DESC, id DESC LIMIT {$from_record_num}, {$records_per_page}";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    # Get one course, query by slug
    function getOne()
    {
        $query = "SELECT * FROM courses WHERE id = :id LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($data[0])){
            $Teacher = new UserModel();
            $Teacher->getOne($data[0]['teacher']);
            $Category = new CategoryModel();
            $Category->getOne($data[0]['category']);
            $this->id = $data[0]['id'];
            $this->name = $data[0]['name'];
            $this->description = $data[0]['description'];
            $this->teacher = !is_null($Teacher->id) ? array(
                'id' => $Teacher->id,
                'display_name' => $Teacher->display_name,
                'firstname' => $Teacher->firstname,
                'lastname' => $Teacher->lastname,
                'avatar_url' => $Teacher->avatar_url,
            ) : null;
            $this->category = !is_null($Category->id) ? array(
                'id' => $Category->id,
                'name' => $Category->name,
                'slug' => $Category->slug,
            ) : null;
            $this->keywords = explode(",",$data[0]['keywords']);
            $this->create_date = $data[0]['create_date'];
            $this->create_uid = $data[0]['create_uid'];
            $this->thumbnail_url = $data[0]['thumbnail_url'];
            return true;
        }
        
        return False;
    }

    # Method to check if slug already exists
    function slugExists()
    {
        $query = "SELECT id FROM courses WHERE slug = :slug LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->execute();
        $num = $stmt->rowCount();

        if ($num > 0) {
            return true;
        }

        return false;
    }
}