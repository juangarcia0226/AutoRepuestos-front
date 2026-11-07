# AutoRepuestos

Prototipo de un sistema de gestión de inventario para una tienda de repuestos de vehículos.
Desarrollado con React + Vite, Bootstrap 5 (por CDN) y datos simulados guardados en LocalStorage.

## Funcionalidades

- **Login** con validación y sesión simulada.
- **Inventario:** tarjetas de resumen, tabla con buscador, alertas de stock y últimos movimientos.
- **Buscar por vehículo:** marca, modelo y año para listar los repuestos compatibles.
- **Detalle del repuesto:** datos, ubicación en la tienda y vehículos compatibles.

## Requisitos

- Node.js (versión LTS reciente)

## Instalación y uso

```bash
npm install
npm run dev
```

## Cuenta de prueba

- Correo: `admin@autorepuestos.com`
- Contraseña: `123456`

## Estructura

```
src/
├── components/   piezas reutilizables (menú, tarjetas, tablas, formularios)
├── context/      sesión del usuario (AuthProvider, useAuth)
├── data/         datos iniciales (productos, vehículos, compatibilidad, movimientos)
├── pages/        Login, Dashboard, Vehiculos, Producto
├── routers/      rutas de la app, ruta pública y ruta protegida
├── services/     acceso a LocalStorage y operaciones sobre el inventario
├── styles/       estilos por pantalla
└── utils/        formato de precios y estado de stock
```

## Datos y LocalStorage

La primera vez que se abre la app, los datos de `src/data/` se copian a LocalStorage
(claves con el prefijo `autorepuestos:`). A partir de ahí la app lee desde LocalStorage.

Para restaurar los datos iniciales, abre las herramientas del navegador (F12) →
Application → Local Storage, borra las claves `autorepuestos:*` y recarga la página.

## Próximos pasos

- Agregar, editar y eliminar productos.
- Registrar entradas y salidas de stock.
- Conectar un backend real.