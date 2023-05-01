<?php

require_once 'app/config/database.php';

class AttachmentModel
{
    private $conn;

    public $id;
    public $name;
    public $fileUrl;
    public $courseContent;
    public $create_date;
    public $create_uid;

    public function __construct()
    {
        $this->conn = Connection::connectDB();
    }

    function create()
    {
        $query = "INSERT INTO attachments
                SET
                    name=:name,
                    file_url=:file_url,
                    course_content=:course_content,
                    create_date=:create_date,
                    create_uid=:create_uid";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->fileUrl = htmlspecialchars(strip_tags($this->fileUrl));
        $this->courseContent = htmlspecialchars(strip_tags($this->courseContent));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->create_uid = htmlspecialchars(strip_tags($this->create_uid));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":file_url", $this->fileUrl);
        $stmt->bindParam(":course_content", $this->courseContent);
        $stmt->bindParam(":create_date", $this->create_date);
        $stmt->bindParam(":create_uid", $this->create_uid);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function getAll($from_record_num, $records_per_page)
    {
        $query = "SELECT
                    id, name, file_url, course_content, create_date, create_uid
                FROM
                    attachments
                WHERE course_content = ?
                ORDER BY
                    id ASC
                LIMIT
                    ?, ?";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(1, $this->courseContent);
        $stmt->bindParam(2, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(3, $records_per_page, PDO::PARAM_INT);

        $stmt->execute();

        return $stmt;
    }

    function getOne()
    {
        $query = "SELECT
                    id, name, file_url, course_content, create_date, create_uid
                FROM
                    attachments
                WHERE
                    id = ?
                LIMIT
                    0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->fileUrl = $row['file_url'];
            $this->courseContent = $row['course_content'];
            $this->create_date = $row['create_date'];
            $this->create_uid = $row['create_uid'];
            return true;
        }

        return false;
    }

    function update()
    {
        $query = "UPDATE
                    attachments
                SET
                    name=:name,
                    file_url=:file_url,
                    course_content=:course_content,
                    create_date=:create_date,
                WHERE
                    id = :id";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->fileUrl = htmlspecialchars(strip_tags($this->fileUrl));
        $this->courseContent = htmlspecialchars(strip_tags($this->courseContent));
        $this->create_date = htmlspecialchars(strip_tags($this->create_date));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":file_url", $this->fileUrl);
        $stmt->bindParam(":course_content", $this->courseContent);
        $stmt->bindParam(":create_date", $this->create_date);
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function delete()
    {
        $query = "DELETE FROM attachments WHERE id = ?";

        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    function search($keywords)
    {
        $query = "SELECT
                    id, name, file_url, course_content, create_date, create_uid
                FROM
                    attachments
                WHERE
                    name LIKE ? OR description LIKE ?
                ORDER BY
                    id DESC";

        $stmt = $this->conn->prepare($query);

        $keywords = htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);

        $stmt->execute();

        return $stmt;
    }

    function readPaging($from_record_num, $records_per_page)
    {
        $query = "SELECT
                    id, name, file_url, course_content, create_date, create_uid
                FROM
                    attachments
                ORDER BY id DESC
                LIMIT ?, ?";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(1, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(2, $records_per_page, PDO::PARAM_INT);

        $stmt->execute();

        return $stmt;
    }

    public function count()
    {
        $query = "SELECT COUNT(*) as total_rows FROM attachments WHERE course_content = ?";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(1, $this->courseContent, PDO::PARAM_INT);

        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total_rows'];
    }
}

?>