create database StockSpot;
use StockSpot;

create table Empleado(
	ID_Empleado integer AUTO_INCREMENT,
	Nombre varchar(45) not null,
    Edad integer not null,
    Sexo varchar(1) not null,
    Correo_Electronico varchar(40) not null,
    Sueldo double not null,
    Foto longblob,
    Contraseña varchar(16),
    primary key(ID_Empleado)
);


create table Producto(
	ID_Producto integer auto_increment not null,
    Nombre varchar(45) not null,
    Precio double not null,
    Descripcion varchar(100),
    Stock integer not null,
    primary key(ID_Producto)
);



create table Venta(
	ID integer auto_increment not null,
    ID_Empleado integer not null,
    Monto double not null,
    Fecha date not null,
    primary key (ID), 
    foreign key (ID_Empleado) references Empleado(ID_Empleado)
);

create table Proveedor(
	ID_Proveedor integer auto_increment not null,
    Nombre varchar(45),
	Correo_Electronico varchar(35),
	primary key(ID_Proveedor)
);
create table Compra(
	ID integer auto_increment not null,
    ID_Empleado integer not null,
    ID_Proveedor integer not null,
    Monto double not null,
    Fecha date not null,
    primary key (ID), 
    foreign key (ID_Empleado) references Empleado(ID_Empleado),
     foreign key (ID_Proveedor) references Proveedor(ID_Proveedor)
);

create table Orden(
	ID integer not null,
    ID_Producto integer not null,
    Cantidad integer not null,
	
    foreign key(ID) references Venta(ID),
	foreign key(ID) references Compra(ID),
	foreign key(ID_Producto) references Producto(ID_Producto)
    
);

INSERT INTO `Empleado` (`ID_Empleado`, `Nombre`, `Edad`, `Sexo`, `Correo_Electronico`, `Sueldo`, `Foto`, `Contraseña`) VALUES (NULL, 'Administrador', '20', 'M', 'admin@admin.com', '1000000', NULL, 'admin')
