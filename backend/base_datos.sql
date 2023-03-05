create database proyecto;
use proyecto;

create table usuario(
	id_usuario int auto_increment primary key,
    nombre varchar(255),
    pass varchar(255),
    tipo_usuario tinyint);
 
insert into usuario(nombre, pass, tipo_usuario) values('admin', '$2y$10$vu62qV9qCtib7RYJ6XaFAerQpdpbrP9V.1u4YCo1o0eg9d8m7rG4a', 0);
-- Usuario 'admin'. Contraseña 'linkia'
