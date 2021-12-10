-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 10-12-2021 a las 05:47:27
-- Versión del servidor: 10.4.22-MariaDB
-- Versión de PHP: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `StockSpot`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Compra`
--

CREATE TABLE `Compra` (
  `ID` int(11) NOT NULL,
  `ID_Empleado` int(11) NOT NULL,
  `ID_Proveedor` int(11) NOT NULL,
  `Monto` double NOT NULL,
  `Fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Empleado`
--

CREATE TABLE `Empleado` (
  `ID_Empleado` int(11) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `Edad` int(11) NOT NULL,
  `Sexo` varchar(1) NOT NULL,
  `Correo_Electronico` varchar(40) NOT NULL,
  `Sueldo` double NOT NULL,
  `Foto` longblob DEFAULT NULL,
  `Contraseña` varchar(16) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Empleado`
--

INSERT INTO `Empleado` (`ID_Empleado`, `Nombre`, `Edad`, `Sexo`, `Correo_Electronico`, `Sueldo`, `Foto`, `Contraseña`) VALUES
(2, 'Administrador', 20, 'M', 'admin@admin.com', 1000000, NULL, 'admin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Orden`
--

CREATE TABLE `Orden` (
  `ID` int(11) NOT NULL,
  `ID_Producto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Producto`
--

CREATE TABLE `Producto` (
  `ID_Producto` int(11) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `Precio` double NOT NULL,
  `Descripcion` varchar(100) DEFAULT NULL,
  `Stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Producto`
--

INSERT INTO `Producto` (`ID_Producto`, `Nombre`, `Precio`, `Descripcion`, `Stock`) VALUES
(1, 'Agua Alcalina', 55.5, 'Agua alcalina de 1500 mL, Ph. 8.8', 5),
(2, 'Galletas', 12, 'Galletas de mantequilla ', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Proveedor`
--

CREATE TABLE `Proveedor` (
  `ID_Proveedor` int(11) NOT NULL,
  `Nombre` varchar(45) DEFAULT NULL,
  `Numero` varchar(10) NOT NULL,
  `Compania` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `Proveedor`
--

INSERT INTO `Proveedor` (`ID_Proveedor`, `Nombre`, `Numero`, `Compania`) VALUES
(1, 'Miguel', '3334567890', 'Marinela'),
(2, 'José', '1234567890', 'Pepsico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Venta`
--

CREATE TABLE `Venta` (
  `ID` int(11) NOT NULL,
  `ID_Empleado` int(11) NOT NULL,
  `Monto` double NOT NULL,
  `Fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Compra`
--
ALTER TABLE `Compra`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_Empleado` (`ID_Empleado`),
  ADD KEY `ID_Proveedor` (`ID_Proveedor`);

--
-- Indices de la tabla `Empleado`
--
ALTER TABLE `Empleado`
  ADD PRIMARY KEY (`ID_Empleado`);

--
-- Indices de la tabla `Orden`
--
ALTER TABLE `Orden`
  ADD KEY `ID` (`ID`),
  ADD KEY `ID_Producto` (`ID_Producto`);

--
-- Indices de la tabla `Producto`
--
ALTER TABLE `Producto`
  ADD PRIMARY KEY (`ID_Producto`);

--
-- Indices de la tabla `Proveedor`
--
ALTER TABLE `Proveedor`
  ADD PRIMARY KEY (`ID_Proveedor`);

--
-- Indices de la tabla `Venta`
--
ALTER TABLE `Venta`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID_Empleado` (`ID_Empleado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `Compra`
--
ALTER TABLE `Compra`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `Empleado`
--
ALTER TABLE `Empleado`
  MODIFY `ID_Empleado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `Producto`
--
ALTER TABLE `Producto`
  MODIFY `ID_Producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `Proveedor`
--
ALTER TABLE `Proveedor`
  MODIFY `ID_Proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `Venta`
--
ALTER TABLE `Venta`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Compra`
--
ALTER TABLE `Compra`
  ADD CONSTRAINT `Compra_ibfk_1` FOREIGN KEY (`ID_Empleado`) REFERENCES `Empleado` (`ID_Empleado`),
  ADD CONSTRAINT `Compra_ibfk_2` FOREIGN KEY (`ID_Proveedor`) REFERENCES `Proveedor` (`ID_Proveedor`);

--
-- Filtros para la tabla `Orden`
--
ALTER TABLE `Orden`
  ADD CONSTRAINT `Orden_ibfk_1` FOREIGN KEY (`ID`) REFERENCES `Venta` (`ID`),
  ADD CONSTRAINT `Orden_ibfk_2` FOREIGN KEY (`ID`) REFERENCES `Compra` (`ID`),
  ADD CONSTRAINT `Orden_ibfk_3` FOREIGN KEY (`ID_Producto`) REFERENCES `Producto` (`ID_Producto`);

--
-- Filtros para la tabla `Venta`
--
ALTER TABLE `Venta`
  ADD CONSTRAINT `Venta_ibfk_1` FOREIGN KEY (`ID_Empleado`) REFERENCES `Empleado` (`ID_Empleado`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
