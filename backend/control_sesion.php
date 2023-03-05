<?php
session_start();
	
	if(!isset($_SESSION['id_usuario'])){
		header("Location: index.php");
	}
	
	function controlSesionAdmin(){
		if($_SESSION['tipo_usuario'] != 0){
			header("Location: index.php");
		}
	}
	
	function controlSesionUser(){
		if($_SESSION['tipo_usuario'] != 1){
			header("Location: index.php");
		}
	}
?>