<?php
require_once("control_sesion.php");
require_once("database.php");
	
	controlSesionAdmin();
	
	if(isset($_GET['user'])){
		borrarUsuario($_GET['user']);
		header("Location: admin.php");
	}
?>