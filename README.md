# Inventory Frontend

App Angular (standalone + Tailwind) para el flujo de **Órdenes de compra**,
**Stock** y **Alertas** del backend `inventory-api`.

## Alcance de esta primera versión

- **Órdenes**: listar, crear (proveedor + líneas de producto/cantidad),
  aprobar, rechazar y recibir.
- **Stock**: ver el stock actual vs. mínimo de cada producto.
- **Alertas**: ver alertas activas/cerradas (se abren y cierran solas al
  registrar movimientos de inventario, no hay pantalla de creación manual).

No incluye todavía CRUD de Suppliers/Products (se consumen en modo lectura
para poblar los selects).

## Requisitos

- Node 18+ y npm
- El backend `inventory-api` corriendo en `http://localhost:3000`
  (`npm run dev` dentro de esa carpeta)

## Instalación

```bash
cd inventory-frontend
npm install
```

## Ejecutar en desarrollo

```bash
npm start
```

Levanta la app en `http://localhost:4200`. Las peticiones a `/api/*` se
redirigen automáticamente al backend en `http://localhost:3000` gracias a
`proxy.conf.json` — **no hace falta configurar CORS en el backend**.

Si tu backend corre en otro puerto, edita `proxy.conf.json`.

## Build de producción

```bash
npm run build
```

Genera los archivos estáticos en `dist/inventory-frontend`. Como el build de
producción no usa el proxy de desarrollo, tendrás que servir estos archivos
detrás de algo que reenvíe `/api` al backend real, o cambiar `apiUrl` en
`src/environments/environment.ts` por la URL absoluta de tu API.

## Estructura

```
src/app/
  core/
    models/       DTOs y enums, espejo exacto de los del backend
    services/      un servicio HttpClient por entidad
    utils/         helper para leer el mensaje de AppError
  features/
    orders/        listado + creación de órdenes
    stock/         listado de stock
    alerts/        listado de alertas
```
