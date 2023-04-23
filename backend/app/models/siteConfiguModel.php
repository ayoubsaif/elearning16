<?php

require_once 'app/config/database_23-04-2023.php';

class siteConfigModel
{
    private $conn;
    private $table_name = "site_config";

    public $id;
    public $hero_action;
    public $menu;
    public $create_uid;
    public $logo_url;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    hero_action=:hero_action,
                    menu=:menu,
                    create_uid=:create_uid,
                    logo_url=:logo_url";

        $stmt = $this->conn->prepare($query);

        $this->hero_action = htmlspecialchars(strip_tags($this->hero_action));
        $this->menu = htmlspecialchars(strip_tags($this->menu));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));
        $this->logo_url = htmlspecialchars(strip_tags($this->logo_url));

        $stmt->bindParam(":hero_action", $this->hero_action);
        $stmt->bindParam(":menu", $this->menu);
        $stmt->bindParam(":create_uid", $this->create_uid);
        $stmt->bindParam(":logo_url", $this->logo_url);

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
                hero_action=:hero_action,
                menu=:menu,
                create_uid=:create_uid,
                logo_url=:logo_url
            WHERE
                id=:id";

        $stmt = $this->conn->prepare($query);
        $this->hero_action = htmlspecialchars(strip_tags($this->hero_action));
        $this->menu = htmlspecialchars(strip_tags($this->menu));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));
        $this->logo_url = htmlspecialchars(strip_tags($this->logo_url));

        $stmt->bindParam(":hero_action", $this->hero_action);
        $stmt->bindParam(":menu", $this->menu);
        $stmt->bindParam(":create_uid", $this->create_uid);
        $stmt->bindParam(":logo_url", $this->logo_url);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }
}