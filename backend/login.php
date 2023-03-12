<?php
session_start();
require_once("database.php");

	if(empty($_POST['username']) || empty($_POST['password'])){
		$_SESSION['error_login'] = "Debes introducir tu nombre de usuario y tu contraseña";
		header("Location: index.php");
	}
	else{
		$username = $_POST['username'];
		$password = $_POST['password'];
		
		$resultado = login($username, $password);
		if($resultado == 0){
			$_SESSION['error_login'] = "Datos incorrectos";
			header("Location: index.php");
		}
		else{
			$_SESSION['id_usuario'] = $resultado['id_usuario'];
			$_SESSION['username'] = $resultado['nombre'];
			$_SESSION['tipo_usuario'] = $resultado['tipo_usuario'];
			if($_SESSION['tipo_usuario'] == 0){
				header("Location: admin.php");
			}
			else{
				header("Location: user.php");
			}
		}
	}
	
	cerrarConexion($con);
?>