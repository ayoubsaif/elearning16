<?php

require_once 'app/config/database.php';

class siteConfigModel
{
    private $conn;

    public $id;
    public $hero_action;
    public $menu;
    public $create_uid;
    public $logo_url;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    function update()
    {
        $query = "UPDATE site_config
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

    function get()
    {
        $query = "SELECT * FROM site_config LIMIT 1";
        $stmt = $this->conn->prepare($query);

        # check if query return data or not
        if ($stmt->execute() && $stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->hero_action = $row['hero_action'];
            $this->menu = $row['menu'];
            $this->create_uid = $row['create_uid'];
            $this->logo_url = $row['logo_url'];
            return true;
        } else {
            return false;
        }

        return false;
    }
    
}