<?php
require_once("database.php");

echo "<form method='post' action='".$_SERVER['PHP_SELF']."'>
		Nombre de usuario:<input type='text' name='username'><br/>
		Contraseña:<input type='password' name='password'><br/>
		Tipo:<select name='tipo_usuario'>
			<option value='1'>Usuario</option>
		</select>
		<input type='submit' name='crear' value='Crear'>";

	if(isset($_POST['crear'])){
		if(empty($_POST['username']) || empty($_POST['password'])){
			echo "Debes rellenar todos los campos";
		}
		else{
			$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
			insertarUsuario($_POST['username'], $password, $_POST['tipo_usuario']);
			header("Location: index.php");
		}
	}

    ?>