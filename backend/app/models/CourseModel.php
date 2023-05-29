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
                    id=:id,
                    name=:name,
                    slug=:slug,
                    description=:description,
                    category=:category,
                    keywords=:keywords,
                    create_date=:create_date,
                    create_uid=:create_uid,
                    thumbnail_url=:thumbnail_url";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->keywords = htmlspecialchars(strip_tags($this->keywords));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));
        $this->thumbnail_url = htmlspecialchars(strip_tags($this->thumbnail_url));

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":category", $this->category);
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

    function update($setClouse)
    {
        try{
            $query = "UPDATE courses
            SET " . implode(", ", $setClouse) . "
            WHERE id = :id";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":id", $this->id);

            if ($stmt->execute()) {
                return true;
            }

            return false;
        }catch(Exception $e){
            echo $e->getMessage();
        }
    }

    function getMany($args, $currentPage = 1, $records_per_page = 12)
    {
        // Calculate the offset value based on the current page number and the number of records per page
        $offset = ($currentPage - 1) * $records_per_page;
        $whereClouse = "";
        if (count($args) > 0) {
            $whereClouse = "WHERE " . implode("AND ", $args) . "";
        }

        $query = "SELECT id, slug, name, description, thumbnail_url, create_date
            FROM courses 
            $whereClouse
            ORDER BY id DESC LIMIT {$offset}, {$records_per_page}";
            
        // Calculate the total number of pages
        $totalRecords = $this->getTotalRecords($whereClouse);
        $pagesCount = ceil($totalRecords / $records_per_page);

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        if ($totalRecords) {
            $courses_arr = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $course_item = array(
                    "id" => $id,
                    "slug" => $slug,
                    "name" => $name,
                    "description" => $description,
                    "thumbnail" => $thumbnail_url,
                    "create_date" => $create_date,
                );
                array_push($courses_arr, $course_item);
            }
            return array(
                'courses' => $courses_arr,
                'pagination' => array(
                    'totalItems' => $totalRecords,
                    'currentPage' => $currentPage,
                    'pagesCount' => $pagesCount,
                    'recordsPerPage' => $records_per_page,
                )
            );
        }else{
            return array(
                'courses' => [],
                'pagination' => array(
                    'totalItems' => $totalRecords,
                    'currentPage' => $currentPage,
                    'pagesCount' => $pagesCount,
                    'recordsPerPage' => $records_per_page,
                )
            );
        }
    }

    function getManyByCategory($category, $args, $currentPage = 1, $records_per_page = 12)
    {
        $offset = ($currentPage - 1) * $records_per_page;
        $whereClouse = "WHERE category = {$category}";
        if (count($args) > 0) {
            $whereClouse = $whereClouse . " AND " . implode("AND ", $args) . "";
        }

        $query = "SELECT id, name, slug, description, thumbnail_url, create_date
            FROM courses 
            $whereClouse
            ORDER BY id DESC LIMIT {$offset}, {$records_per_page}";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate the total number of pages
        $totalRecords = $this->getTotalRecords($whereClouse);
        $pagesCount = ceil($totalRecords / $records_per_page);

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        if ($totalRecords) {
            $courses_arr = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $course_item = array(
                    "id" => $id,
                    "slug" => $slug,
                    "name" => $name,
                    "description" => $description,
                    "thumbnail" => $thumbnail_url,
                    "create_date" => $create_date,
                );
                array_push($courses_arr, $course_item);
            }
            return array(
                'courses' => $courses_arr,
                'pagination' => array(
                    'totalItems' => $totalRecords,
                    'currentPage' => $currentPage,
                    'pagesCount' => $pagesCount,
                    'recordsPerPage' => $records_per_page,
                )
            );
        }

        return array(
            'courses' => [],
            'pagination' => array(
                'totalItems' => $totalRecords,
                'currentPage' => $currentPage,
                'pagesCount' => $pagesCount,
                'recordsPerPage' => $records_per_page,
            )
        );
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
    function getOne($id)
    {
        try {
            $query = "SELECT * FROM courses WHERE id = ? LIMIT 1";

            $stmt = $this->conn->prepare($query);
            if (isset($id)) {
                $stmt->bindParam(1, $id);
            } else {
                $stmt->bindParam(1, $this->id);
            }
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (!empty($data[0])) {
                $this->id = $data[0]['id'];
                $this->name = $data[0]['name'];
                $this->slug = $data[0]['slug'];
                $this->description = $data[0]['description'];
                $this->category = $data[0]['category'];
                $this->keywords = explode(",", $data[0]['keywords']);
                $this->create_date = $data[0]['create_date'];
                $this->create_uid = $data[0]['create_uid'];
                $this->thumbnail_url = $data[0]['thumbnail_url'];
                return true;
            }

            return False;
        } catch (Exception $e) {
            return False;
        }
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

    function getLastId()
    {
        $query = "SELECT id FROM courses ORDER BY id DESC LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($data[0])) {
            return $data[0]['id'];
        }

        return null;
    }
}
