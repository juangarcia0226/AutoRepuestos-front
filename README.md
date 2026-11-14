# AutoRepuestos

Sistema de gestión de inventario para una tienda de repuestos de vehículos.
Desarrollado con React + Vite y Bootstrap 5 (por CDN), conectado a la API de AutoRepuestos.

## Funcionalidades

- **Login** con validación y sesión mediante token JWT.
- **Inventario:** tarjetas de resumen, tabla con buscador, alertas de stock y últimos movimientos.
- **Productos:** crear, editar y ver el detalle con su ubicación en la tienda.
- **Compatibilidad:** agregar y quitar los vehículos compatibles de cada repuesto.
- **Movimientos:** registrar entradas y salidas de stock.
- **Buscar por vehículo:** marca, modelo y año para listar los repuestos compatibles.
- **Catálogo de vehículos:** crear, editar y eliminar vehículos.

## Requisitos

- Node.js (versión LTS reciente)
- El backend de AutoRepuestos en ejecución

## Instalación y uso

```bash
npm install
cp .env.example .env     # y ajustar VITE_API_URL si el backend usa otra dirección
npm run dev
```

Otros comandos:

```bash
npm run build     # genera la versión de producción en /dist
npm run preview   # sirve esa versión para probarla
npm run lint      # revisa el código con ESLint
```

## Cuenta de prueba

- Correo: `admin@autorepuestos.com`
- Contraseña: `123456`

## Estructura

```
src/
├── components/   piezas reutilizables (menú, tarjetas, tablas, formularios, ventanas)
├── context/      sesión del usuario (AuthProvider, useAuth)
├── hooks/        useCarga: carga de datos con estados de carga y error
├── pages/        Login, Dashboard, Vehiculos, CatalogoVehiculos, Producto
├── routers/      rutas de la app, ruta pública y ruta protegida
├── services/     cliente de la API (api.js, authService, inventarioApi) y storage
├── styles/       estilos por pantalla
└── utils/        formato de precios y fechas, estado de stock
```

## Datos y sesión

Los datos viven en MongoDB Atlas y se consultan a través de la API
(`VITE_API_URL`). El token de sesión se guarda en LocalStorage con la clave
`autorepuestos:token`; si vence, la app vuelve al login.

## Próximos pasos

- Eliminar productos desde la interfaz.
- Ajustar automáticamente los rangos de años de los productos al cambiar un vehículo.
- Gestión de usuarios y roles.
- Despliegue del backend y del front.