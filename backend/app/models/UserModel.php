<?php

require_once 'app/config/database.php';

class UserModel
{
    private $conn;

    public $id;
    public $display_name;
    public $firstname;
    public $lastname;
    public $username;
    public $email;
    public $password;
    public $create_date;
    public $create_uid;
    public $avatar_url;
    public $permissionType;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
        $this->display_name = $this->firstname . " " . $this->lastname;
    }

    function create()
    {
        try{
            $query = "INSERT INTO users
                    SET
                        firstname=:firstname,
                        lastname=:lastname,
                        username=:username,
                        email=:email,
                        password=:password";

            $stmt = $this->conn->prepare($query);

            $this->firstname = htmlspecialchars(strip_tags($this->firstname));
            $this->lastname = htmlspecialchars(strip_tags($this->lastname));
            $this->username = htmlspecialchars(strip_tags($this->username));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->password = htmlspecialchars(strip_tags($this->password));

            $password_hash = password_hash($this->password, PASSWORD_BCRYPT);

            $stmt->bindParam(":firstname", $this->firstname);
            $stmt->bindParam(":lastname", $this->lastname);
            $stmt->bindParam(":username", $this->username);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":password", $password_hash);

            if ($stmt->execute()) {
                return true;
            }

            return false;
        }catch(Exception $e){
            return false;
        }
    }

    function emailExists()
    {
        try{
            $query = "SELECT id, firstname, lastname, password
                        FROM users
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
                $this->firstname = $row['firstname'];
                $this->lastname = $row['lastname'];
                $this->display_name = $this->firstname . " " . $this->lastname;
                $this->password = $row['password'];
                return true;
            }
            return false;
        }catch(Exception $e){
            return false;
        }
    }

    function validatePassword($password)
    {
        return password_verify($password, $this->password);
    }

    function getOne($id){
        try{
            $query = "SELECT id, firstname, lastname, email, avatar_url, permission_type
            FROM users
            WHERE id = ?
            LIMIT 1";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $id);
            $stmt->execute();
            $num = $stmt->rowCount();

            if ($num > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $this->id = $row['id'];
                $this->firstname = $row['firstname'];
                $this->lastname = $row['lastname'];
                $this->display_name = $this->firstname . " " . $this->lastname;
                $this->email = $row['email'];
                $this->avatar_url = $row['avatar_url'];
                $this->permissionType = $row['permission_type'];
                return true;
            }
            return false;
        }catch (Exception $e){
            return false;
        }
    }
}
