<?php
session_start();
require_once("database.php");

	
	echo "<h3>Bienvenidos a nuestro proyecto!</h3>";
	echo "<form method ='post' action='login.php'>
		Usuario:<input type='text' name='username'><br/>
		Contraseña:<input type='password' name='password'><br/>
		<input type='submit' value='Entrar'>
	</form>";

	echo "<a href='registrar_usuario.php'>REGÍSTRATE</a>";

	if(isset($_SESSION['error_login'])){
		echo $_SESSION['error_login'];
		unset($_SESSION['error_login']);
	}

	
?>