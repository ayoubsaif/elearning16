<?php
require_once("control_sesion.php");
require_once("database.php");

	echo "<h3>Bienvenido ".$_SESSION['username']."</h3>";
	
	echo "<a href='logout.php'>Logout</a>";
	
	
	cerrarConexion($con);
	?>