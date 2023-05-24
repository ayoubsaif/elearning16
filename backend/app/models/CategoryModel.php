<?php

require_once 'app/config/database.php';

class CategoryModel
{
    private $conn;

    public $id;
    public $name;
    public $slug;
    public $description;
    public $image_url;
    public $parent_cat;
    public $keywords;
    public $create_uid;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    function create()
    {
        $query = "INSERT INTO categories
                SET
                    name=:name,
                    slug=:slug,
                    description=:description,
                    image_url=:image_url,
                    parent_cat=:parent_cat,
                    keywords=:keywords,
                    create_uid=:create_uid";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->image_url = htmlspecialchars(strip_tags($this->image_url));
        $this->parent_cat = htmlspecialchars(strip_tags($this->parent_cat));
        $this->keywords = htmlspecialchars(strip_tags($this->keywords));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":parent_cat", $this->parent_cat);
        $stmt->bindParam(":keywords", $this->keywords);
        $stmt->bindParam(":create_uid", $this->create_uid);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }


    function delete($id)
    {
        $query = "DELETE FROM categories WHERE id = :id";
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
        $query = "UPDATE categories
            SET
                name=:name,
                slug=:slug,
                description=:description,
                image_url=:image_url,
                parent_cat=:parent_cat,
                keywords=:keywords,
                create_uid=:create_uid
            WHERE
                id=:id";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->slug = htmlspecialchars(strip_tags($this->slug));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->image_url = htmlspecialchars(strip_tags($this->image_url));
        $this->parent_cat = htmlspecialchars(strip_tags($this->parent_cat));
        $this->keywords = htmlspecialchars(strip_tags($this->keywords));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":slug", $this->slug);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":parent_cat", $this->parent_cat);
        $stmt->bindParam(":keywords", $this->keywords);
        $stmt->bindParam(":create_uid", $this->create_uid);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function getAll()
    {
        $query = "SELECT * FROM categories";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $categories_arr = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $category_item = array(
                "id" => $id,
                "name" => $name,
                "slug" => $slug,
                "description" => $description,
                "image_url" => $image_url,
                "parent_cat" => $parent_cat,
                "keywords" => $keywords,
                "create_uid" => $create_uid
            );

            array_push($categories_arr, $category_item);
        }

        return $categories_arr;
    }


    function getOne($slug)
    {
        $query = "SELECT * FROM categories WHERE slug = :slug LIMIT 1";
        $stmt = $this->conn->prepare($query);

        $slug = htmlspecialchars(strip_tags($slug));
        $stmt->bindParam(":slug", $slug);

        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!empty($data[0])){
            $this->id = $data[0]['id'];
            $this->name = $data[0]['name'];
            $this->slug = $data[0]['slug'];
            $this->description = $data[0]['description'];
            $this->image_url = $data[0]['image_url'];
            $this->parent_cat = $data[0]['parent_cat'];
            $this->keywords = $data[0]['keywords'];
            $this->create_uid = $data[0]['create_uid'];
            return true;
        }

        return false;
    }
}
