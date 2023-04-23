<?php

require_once 'app/config/database_23-04-2023.php';

class categoriesModel
{
    private $conn;
    private $table_name = "categories";

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
        $query = "INSERT INTO " . $this->table_name . "
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
}
