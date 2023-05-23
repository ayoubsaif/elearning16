<?php

require_once 'app/config/database.php';
require_once 'app/models/UserModel.php';
require_once 'app/models/CourseContentModel.php';
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
    public $courseContents;

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

    function getMany($args, $currentPage = 1, $records_per_page = 12)
    {
        // Calculate the offset value based on the current page number and the number of records per page
        $offset = ($currentPage - 1) * $records_per_page;
        $whereClouse = "";
        if (count($args) > 0) {
            $whereClouse = "WHERE ".implode("AND ", $args)."";
        }

        $query = "SELECT id, name, description, thumbnail_url, slug
            FROM courses 
            $whereClouse
            ORDER BY id DESC LIMIT {$offset}, {$records_per_page}";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate the total number of pages
        $totalRecords = $this->getTotalRecords($whereClouse);
        $pagesCount = ceil($totalRecords / $records_per_page);

        if ($data) {
            return array(
                'courses' => $data,
                'pagination' => array(
                    'currentPage' => $currentPage,
                    'pagesCount' => $pagesCount,
                    'recordsPerPage' => $records_per_page,
                )
            );
        }

        return $data;
    }

    function getTotalRecords($whereClouse)
    {
        $query = "SELECT COUNT(*) as total_rows FROM courses $whereClouse";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $total_rows = $row['total_rows'];
        return $total_rows;
    }


    function getPagesCount($records_per_page)
    {
        $query = "SELECT COUNT(*) as total_rows FROM courses";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $total_rows = $row['total_rows'];
        $pagesCount = ceil($total_rows / $records_per_page);
        return $pagesCount;
    }

    # Get one course, query by slug-id
    function getOne()
    {
        $query = "SELECT * FROM courses WHERE id = :id LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($data[0])) {
            $Teacher = new UserModel();
            $Teacher->getOne($data[0]['teacher']);
            $Category = new CategoryModel();
            $Category->getOne($data[0]['category']);
            $CourseContent = new CourseContentModel();
            $CourseContent->course = $this->id;

            $this->id = $data[0]['id'];
            $this->name = $data[0]['name'];
            $this->description = $data[0]['description'];
            $this->teacher = !is_null($Teacher->id) ? array(
                'id' => $Teacher->id,
                'name' => $Teacher->display_name,
                'firstname' => $Teacher->firstname,
                'lastname' => $Teacher->lastname,
                'image' => $Teacher->avatar_url,
            ) : null;
            $this->category = !is_null($Category->id) ? array(
                'id' => $Category->id,
                'name' => $Category->name,
                'slug' => $Category->slug,
            ) : null;
            $this->courseContents = $CourseContent->getAll();
            $this->keywords = explode(",", $data[0]['keywords']);
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
