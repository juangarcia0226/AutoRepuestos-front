# AutoRepuestos · Front-end

Aplicación web del sistema de gestión de inventario de AutoRepuestos, una tienda de repuestos de vehículos.
Permite administrar el inventario, encontrar repuestos por vehículo y gestionar usuarios según su rol.

## Tecnologías

- React con Vite
- React Router
- Bootstrap 5 y Bootstrap Icons (por CDN)
- Conexión a la API de AutoRepuestos con autenticación JWT

## Funcionalidades

- **Login** con validación y sesión mediante token JWT.
- **Inventario:** tarjetas de resumen, tabla con buscador, alertas de stock y últimos movimientos.
- **Productos:** crear, editar, eliminar y ver el detalle con su ubicación en la tienda.
- **Compatibilidad:** agregar y quitar los vehículos compatibles de cada repuesto.
- **Movimientos:** registrar entradas y salidas de stock.
- **Buscar por vehículo:** marca, modelo y año para listar los repuestos compatibles.
- **Catálogo de vehículos:** crear, editar y eliminar vehículos. Al reducir sus años, la compatibilidad de los productos se ajusta sola.
- **Usuarios y roles:** crear, editar, desactivar y eliminar usuarios (solo administradores).
- **Cambio de contraseña** desde el menú.

## Roles

| Acción                                                  | Operador | Administrador |
|---------------------------------------------------------|:--------:|:-------------:|
| Consultar inventario, vehículos y detalle de repuestos  | Sí       | Sí            |
| Buscar repuestos por vehículo                           | Sí       | Sí            |
| Registrar entradas y salidas de stock                   | Sí       | Sí            |
| Cambiar la propia contraseña                            | Sí       | Sí            |
| Crear, editar y eliminar productos y vehículos          | No       | Sí            |
| Administrar la compatibilidad de los productos          | No       | Sí            |
| Gestionar usuarios                                      | No       | Sí            |

La interfaz oculta las acciones que el rol no puede hacer, pero la seguridad real la aplica el servidor,
que responde `403` ante cualquier acción sin permiso.

## Requisitos

- Node.js LTS reciente (22 recomendado)
- El backend de AutoRepuestos en ejecución, con `CORS_ORIGIN` incluyendo `http://localhost:5173`

## Instalación y uso

```bash
npm install
cp .env.example .env     # y ajustar VITE_API_URL
npm run dev
```

La aplicación queda en `http://localhost:5173`.

## Variables de entorno

| Variable        | Obligatoria | Descripción                                                              |
|-----------------|-------------|--------------------------------------------------------------------------|
| `VITE_API_URL`  | Sí          | Dirección de la API, con el prefijo `/api/v1` y sin `/` al final. Ejemplo: `http://localhost:5000/api/v1` |

Vite incrusta esta variable en el código **al compilar**, así que debe estar definida antes de `npm run build`.
Antes de compilar, `scripts/verificarEntorno.js` comprueba que exista, que empiece por `http://` o `https://`,
que no termine en `/` y que, en Netlify, no apunte a `localhost`.

## Scripts

| Comando           | Descripción                                                  |
|-------------------|--------------------------------------------------------------|
| `npm run dev`     | Servidor de desarrollo                                       |
| `npm run build`   | Verifica el entorno y genera la versión de producción en `dist/` |
| `npm run preview` | Sirve la versión compilada para probarla                     |
| `npm run lint`    | Revisa el código con ESLint                                  |

## Cuenta de prueba (solo desarrollo)

Se crea en el backend con `npm run crear-admin`:

- Correo: `admin@autorepuestos.com`
- Contraseña: `123456`

El login muestra esta pista solo en desarrollo; la versión compilada no la incluye.

## Estructura

```
src/
├── components/   piezas reutilizables (menú, tablas, formularios y ventanas)
├── context/      sesión del usuario (AuthProvider, useAuth)
├── hooks/        useCarga: carga de datos con estados de carga y error
├── pages/        Login, Dashboard, Vehiculos, CatalogoVehiculos, Producto, Usuarios
├── routers/      rutas de la app: pública, protegida y solo para administradores
├── services/     cliente de la API (api, authService, inventarioApi, usuarioApi) y storage
├── styles/       estilos por pantalla
└── utils/        formato de precios y fechas, estado de stock
scripts/          verificación del entorno antes de compilar
netlify.toml      configuración de despliegue en Netlify
```

## Sesión

El token se guarda en LocalStorage (`autorepuestos:token`) y se envía en cada petición.
Al abrir la aplicación se consulta el perfil al servidor, de modo que el rol y el nombre siempre están al día.
Si el token vence o el usuario deja de ser válido, la aplicación cierra la sesión y vuelve al login.

## Despliegue en Netlify

El archivo `netlify.toml` ya define el comando de compilación, la carpeta publicada, la versión de Node,
la regla que redirige todas las rutas a `index.html` (necesaria para recargar en `/dashboard`) y los encabezados de seguridad.

1. Importar el repositorio en Netlify.
2. Definir la variable `VITE_API_URL` con la dirección pública de la API, **antes** del primer despliegue.
3. En el backend, agregar la dirección del sitio de Netlify a `CORS_ORIGIN`.

## Próximos pasos

- Imágenes reales de los productos.
- Pruebas automáticas.
- Sesiones con cookies `httpOnly` en lugar de LocalStorage.