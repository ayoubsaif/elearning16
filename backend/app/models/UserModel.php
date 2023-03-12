<?php

require_once 'app/config/database.php';

class UserModel
{
    private $conn;
    private $table_name = "users";

    public $id;
    public $name;
    public $lastname;
    public $email;
    public $password;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    name=:name,
                    email=:email,
                    password=:password";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->lastname = htmlspecialchars(strip_tags($this->lastname));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->password = htmlspecialchars(strip_tags($this->password));

        $password_hash = password_hash($this->password, PASSWORD_BCRYPT);

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":lastname", $this->lastname);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":password", $password_hash);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function emailExists()
    {
        $query = "SELECT id, name, lastname, password
                    FROM " . $this->table_name . "
                    WHERE email = ?
                    LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(1, $this->email);
        $stmt->execute();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->lastname = $row['lastname'];
            $this->password = $row['password'];
            return true;
        }
        return false;
    }

    function validatePassword($password)
    {
        return password_verify($password, $this->password);
    }

    function getOne($id){
        $query = "SELECT id, name, email
                    FROM " . $this->table_name . "
                    WHERE id = ?
                    LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->lastname = $row['lastname'];
            $this->email = $row['email'];
            return true;
        }
        return false;
    }
}
