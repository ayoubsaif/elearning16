<?php
require_once("control_sesion.php");
require_once("database.php");
	
	controlSesionAdmin();

	echo "<h2>Página de administración</h2>";
	
	echo "<a href='logout.php'>Logout</a>";
	
	///////////////// GESTION USUARIOS /////////////////
	echo "<h3>Gestión usuarios</h3>";
	
	echo "<a href='crear_usuario.php'>Crear usuario</a>";
	
	$usuarios = listarUsuarios();
	echo "<table border='1'>
			<tr><td>ID</td><td>NOMBRE USUARIO</td><td>TIPO USUARIO</td><td>ACCIONES</td></tr>";
	foreach($usuarios as $usuario){
		echo "<tr>
				<td>".$usuario['id_usuario']."</td>
				<td>".$usuario['nombre']."</td>";
				if($usuario['tipo_usuario'] == 0){
					echo "<td>Admin</td>";
				}
				else{
					echo "<td>User</td>";
				}
				echo "<td>
						<a href='editar_usuario.php?user=".$usuario['id_usuario']."'>Editar</a>
						<a href='borrar_usuario.php?user=".$usuario['id_usuario']."'>Borrar</a>
					</td>
			</tr>";
	}
	echo "</table>";
	
	
	cerrarConexion();
?>