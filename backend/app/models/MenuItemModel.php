<?php

require_once 'app/config/database.php';

class MenuItemModel {
    private $conn;
 
    public $id;
    public $order;
    public $label;
    public $subLabel;
    public $url;
    public $parent_id;
 
    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    public function get()
    {
        $query = "SELECT * FROM menu_items";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $menuItems = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $menuItem = array(
                "id" => $row['id'],
                "order" => $row['order'],
                "label" => $row['label'],
                "subLabel" => $row['subLabel'],
                "url" => $row['url'],
                "parent_id" => $row['parent_id']
            );

            $menuItems[$menuItem['id']] = $menuItem;
        }

        $rootMenuItems = array();
        foreach ($menuItems as &$menuItem) {
            if ($menuItem['parent_id'] && isset($menuItems[$menuItem['parent_id']])) {
                $parentMenuItem = &$menuItems[$menuItem['parent_id']];
                $parentMenuItem['children'][] = &$menuItem;
            } else {
                $rootMenuItems[] = &$menuItem;
            }
        }

        return $rootMenuItems;
    }

    public function create() {
        $query = "INSERT INTO menu_items (label, subLabel, url, parent_id) 
                    VALUES (:label, :subLabel, :url, :parent_id)";
        $stmt = $this->conn->prepare($query);
        $this->label = htmlspecialchars(strip_tags($this->label));
        $this->subLabel = htmlspecialchars(strip_tags($this->subLabel));
        $this->url = htmlspecialchars(strip_tags($this->url));
        $this->parent_id = htmlspecialchars(strip_tags($this->parent_id));
        $stmt->bindParam(":label", $this->label);
        $stmt->bindParam(":subLabel", $this->subLabel);
        $stmt->bindParam(":url", $this->url);
        $stmt->bindParam(":parent_id", $this->parent_id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE menu_items 
                    SET title = :label, 
                        subLabel = :subLabel, 
                        url = :url, 
                        parent_id = :parent_id 
                    WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->label = htmlspecialchars(strip_tags($this->label));
        $this->subLabel = htmlspecialchars(strip_tags($this->subLabel));
        $this->url = htmlspecialchars(strip_tags($this->url));
        $this->parent_id = htmlspecialchars(strip_tags($this->parent_id));
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":label", $this->label);
        $stmt->bindParam(":subLabel", $this->subLabel);
        $stmt->bindParam(":url", $this->url);
        $stmt->bindParam(":parent_id", $this->parent_id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM menu_items WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(":id", $this->id);
        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}