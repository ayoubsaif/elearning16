<?php
require_once("control_sesion.php");
require_once("database.php");
	
	controlSesionAdmin();
	
	if(isset($_GET['user'])){
		$usuario = obtenerUsuario($_GET['user']);
		if($usuario == 0){
			header("Location: admin.php");
		}
		else{
			$_SESSION['id_usuario_update'] = $usuario['id_usuario'];
			echo "<form method='post' action='".$_SERVER['PHP_SELF']."'>
				UserName:<input type='text' name='username' value='".$usuario['nombre']."'><br/>
				Password<input type='password' name='password'><br/>
				Tipo:<select name='tipo_usuario'>";
					if($usuario['tipo_usuario']==0){
						echo "<option value='0' selected>Admin</option>
							<option value='1'>User</option>";
					}
					else{
						echo "<option value='0'>Admin</option>
							<option value='1' selected>User</option>";
					}
				echo "</select>
				<input type='submit' name='editar' value='Editar'>";
		}
	}
	
	if(isset($_POST['editar'])){
		if(empty($_POST['username']) || empty($_POST['password'])){
			echo "Debes rellenar todos los campos";
		}
		else{
			$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
			modificarUsuario($_SESSION['id_usuario_update'], $_POST['username'], $password, $_POST['tipo_usuario']);
			unset($_SESSION['id_usuario_update']);
			header("Location: admin.php");
		}
	}
	
	echo "<br/><a href='admin.php'>Volver</a>";
	cerrarConexion($con);
?>