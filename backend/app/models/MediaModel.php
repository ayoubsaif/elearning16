<?php

class Media
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function uploadMedia($filename, $filepath, $filetype)
    {
        $stmt = $this->db->prepare("INSERT INTO media (filename, filepath, filetype) VALUES (?, ?, ?)");
        $stmt->execute([$filename, $filepath, $filetype]);
    }

    public function getAllMedia()
    {
        $stmt = $this->db->query("SELECT * FROM media");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
