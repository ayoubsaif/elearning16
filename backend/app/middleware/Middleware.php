<?php

class Middleware {

    public $perms = array(
        "admin" => 'admin',
        "teacher" => 'teacher',
        "student" => 'student'
    );

    public function __construct() {
        // Constructor del middleware
    }

    public function handle($allowed) {
        // Método handle que será implementado en las clases hijas
    }
}

?>