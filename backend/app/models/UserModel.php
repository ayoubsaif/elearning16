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
    public $role;
    public $bio;

    # External Auth Provider Identifiers
    public $google_id;

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
                        role=:role,
                        password=:password,
                        avatar_url=:avatar_url,
                        google_id=:google_id"
                        ;

            $stmt = $this->conn->prepare($query);

            $this->firstname = htmlspecialchars(strip_tags($this->firstname));
            $this->lastname = htmlspecialchars(strip_tags($this->lastname));
            $this->username = htmlspecialchars(strip_tags($this->username));
            $this->email = htmlspecialchars(strip_tags($this->email));
            $this->role = $this->role ? htmlspecialchars(strip_tags($this->role)) : 'student';
            $this->password = htmlspecialchars(strip_tags($this->password));
            $this->avatar_url = htmlspecialchars(strip_tags($this->avatar_url));
            $this->google_id = htmlspecialchars(strip_tags($this->google_id));


            $stmt->bindParam(":firstname", $this->firstname);
            $stmt->bindParam(":lastname", $this->lastname);
            $stmt->bindParam(":username", $this->username);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":role", $this->role);
            $password_hash = password_hash($this->password, PASSWORD_BCRYPT);
            $stmt->bindParam(":password", $password_hash);
            $stmt->bindParam(":avatar_url", $this->avatar_url);
            $stmt->bindParam(":google_id", $this->google_id);

            if ($stmt->execute()) {
                return true;
            }

            return false;
        }catch(Exception $e){
            echo json_encode(array("message" => $e->getMessage()));
            return false;
        }
    }

    function emailExists()
    {
        try{
            $query = "SELECT *
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
                $this->id = intval($row['id']);
                $this->firstname = $row['firstname'];
                $this->lastname = $row['lastname'];
                $this->display_name = $this->firstname . " " . $this->lastname;
                $this->username = $row['username'];
                $this->password = $row['password'];
                $this->avatar_url = $row['avatar_url'];
                $this->role = $row['role'];
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
            $query = "SELECT *
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
                $this->username = $row['username'];
                $this->email = $row['email'];
                $this->avatar_url = $row['avatar_url'];
                $this->role = $row['role'];
                $this->bio = $row['bio'];
                return true;
            }
            return false;
        }catch (Exception $e){
            return false;
        }
    }

    function updateProfile($updateProfileValues) {
        try{
            if (count($updateProfileValues) === 0) {
                return true;
            }
            
            $query = "UPDATE users
                    SET ".implode(", ", $updateProfileValues)."
                    WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(":id", $this->id);
            $this->display_name = $this->firstname . " " . $this->lastname;

            if ($stmt->execute()) {
                return true;
            }

            return false;
        }catch(Exception $e){
            return false;
        }
    }

    function googleIdUpdate(){
        try{
            $query = "UPDATE users
                        SET 
                            google_id = :google_id
                        WHERE 
                            id = :id AND google_id != :google_id";
            $stmt = $this->conn->prepare($query);
            
            $this->google_id = htmlspecialchars(strip_tags($this->google_id));
            $stmt->bindParam(":google_id", $this->google_id);
            $stmt->bindParam(":id", $this->id);

            if ($stmt->execute()) {
                return true;
            }
            return false;
        }catch(Exception $e){
            error_log($e->getMessage());
            return false;
        }
    }
}
