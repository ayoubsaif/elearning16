<?php

require_once 'app/config/database.php';

class siteConfigModel
{
    private $conn;

    public $variable;
    public $value;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    function create()
    {
        $query = "INSERT INTO site_config SET variable = :variable, value = :value";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':variable', $this->variable);
        $stmt->bindParam(':value', $this->value);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    function update()
    {
        $query = "SELECT COUNT(*) FROM site_config WHERE variable = :variable";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':variable', $this->variable);
        $stmt->execute();
        $count = $stmt->fetchColumn();
    
        if ($count == 0) {
            return $this->create();
        } else {
            $query = "UPDATE site_config SET value = :value WHERE variable = :variable";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':variable', $this->variable);
            $stmt->bindParam(':value', $this->value);
            if ($stmt->execute()) {
                return true;
            } else {
                $query = "INSERT INTO site_config SET variable = :variable, value = :value";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':variable', $this->variable);
                $stmt->bindParam(':value', $this->value);
                if ($stmt->execute()) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    function get()
    {
        $query = "SELECT * FROM site_config";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $siteConfig = $stmt->fetchAll(PDO::FETCH_OBJ);
        $siteConfigArray = array();
        foreach ($siteConfig as $config) {
            $siteConfigArray[$config->variable] = $config->value;
        }
        if ($siteConfig) {
            return $siteConfigArray;
        } else {
            return false;
        }
    }
    
}