<?php
	$server = "localhost";
	$user = "root";
	$pass = "15121994";
	$db = "proyecto";

	$con = mysqli_connect($server, $user, $pass, $db) or die ("Error al conectar con la base de datos");
	
	function login($username, $password){
		$result = mysqli_query($GLOBALS["con"], "select * from usuario where nombre='$username'");
		if (mysqli_num_rows($result)==1) {
            $usuario = mysqli_fetch_array($result);
            if (password_verify($password, $usuario['pass'])) {
                return $usuario;
            }else{
                return 0;
            }
        }else{
            return 0;
        }
	}
	
	function cerrarConexion(){
		mysqli_close($GLOBALS["con"]);
	}
	
	///////////////////////////////////////////////////////////
	////////////////// FUNCIONES DE USUARIOS //////////////////
	///////////////////////////////////////////////////////////
	
	function listarUsuarios(){
		$result = mysqli_query($GLOBALS["con"], "select * from usuario");
		$usuarios = array();
		while($fila = mysqli_fetch_array($result)){
			$usuarios[] = $fila;
		}
		return $usuarios;//Devuelvo un array con los datos de todos los usuarios
	}
	
	function insertarUsuario($nombre, $pass, $tipo_usuario){
		mysqli_query($GLOBALS["con"], "insert into usuario(nombre, pass, tipo_usuario) values('$nombre', '$pass', $tipo_usuario)");
	}
	
	function obtenerUsuario($id_usuario){
		$resultado = mysqli_query($GLOBALS["con"], "select * from usuario where id_usuario=$id_usuario");
		if(mysqli_num_rows($resultado)==0){
			return 0; //Si no existe el usuario devuelvo 0
		}
		else{
			$usuario = mysqli_fetch_array($resultado);
			return $usuario;//Si existe el usuario devuelvo un array con sus datos
		}
	}
	
	function modificarUsuario($id_usuario, $nombre, $pass, $tipo_usuario){
		mysqli_query($GLOBALS["con"], "update Usuario set nombre='$nombre', pass='$pass', tipo_usuario=$tipo_usuario where id_usuario=$id_usuario");
	}
	
	function borrarUsuario($id_usuario){
		mysqli_query($GLOBALS["con"], "delete from usuario where id_usuario=$id_usuario");
	}
	
?>