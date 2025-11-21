# Preparcial 2 web

API REST desarrollada con NestJS para gestionar países y planes de viaje, utilizando RestCountries como fuente externa de datos de países con sistema de caché local.


## Módulos

La aplicación está organizada en los siguientes módulos:

### CountriesModule
Módulo encargado de gestionar países, utilizando datos obtenidos desde la API externa RestCountries y almacenándolos en una base de datos local como caché.


### TravelPlansModule
Módulo encargado de gestionar planes de viaje, permitiendo crear y consultar planes de viaje asociados a un país.


## Cómo ejecutar el proyecto


```bash
git clone https://github.com/JFH000/prep2-web
cd prep2-web
npm i
npm run start:dev
```






La API estará disponible en: `http://localhost:3000`

## Endpoints

### Módulo de Países (Countries)

#### `GET /countries`
Lista todos los países almacenados.



#### `GET /countries/:alpha3Code`
Consulta un país por su código alpha-3.


**Funcionamiento:**
1. Busca primero en la base de datos local
2. Si existe, devuelve el país indicando `"source": "cache"`
3. Si no existe, consulta RestCountries, guarda en la base de datos y devuelve indicando `"source": "external"`


### Módulo de Planes de Viaje (Travel Plans)

#### `POST /travel-plans`

**Cuerpo de la petición:**
```json
{
  "alpha3Code": "JPN",
  "title": "Aventura en Japón",
  "startDate": "2025-07-01",
  "endDate": "2025-07-14",
  "notes": "Visitar Tokio, Kioto y Osaka"
}
```




#### `GET /travel-plans`
Lista todos los planes de viaje registrados.

#### `GET /travel-plans/:id`
Consulta un plan de viaje específico por su ID.

**Parámetros:**
- `id` (path): UUID del plan de viaje



#### `DELETE /countries/:alpha3Code`
Elimina un país de la caché local. Requiere autenticación.

**Headers requeridos:**
- `Authorization: Bearer web-token`


Errores:
- `401 Unauthorized`: Token faltante o inválido
- `404 Not Found`: País no existe
- `400 Bad Request`: País tiene planes de viaje asociados

---

## Extensiones de la API

En este parcial, la API fue extendida con tres funcionalidades principales: un endpoint protegido para borrar países, un guard de autorización que valida tokens, y un middleware de logging que registra todas las peticiones. El endpoint `DELETE /countries/:alpha3Code` permite eliminar países de la caché, pero requiere un token válido y verifica que no existan planes de viaje asociados antes de permitir el borrado.

El guard `AuthorizationGuard` protege el endpoint de borrado verificando que la petición incluya un header `Authorization` con un token válido. El middleware `LoggingInterceptor` registra automáticamente todas las peticiones a las rutas `/countries` y `/travel-plans`, mostrando en consola el método HTTP, la ruta, el código de estado y el tiempo de procesamiento. 

---

## Funcionalidades de Seguridad y Logging

### Endpoint Protegido: DELETE /countries/:alpha3Code

1. Verifica que el país existe en la base de datos
2. Comprueba que no tenga planes de viaje asociados
3. Valida el token de autorización mediante el guard
4. Si todo es correcto, elimina el país


### Guard de Autorización

El `AuthorizationGuard` verifica que la petición incluya el header `Authorization` con formato `Bearer <token>`. Compara el token con el valor configurado (por defecto: `web-token`) y solo permite el acceso si coincide.


### Middleware de Logging

El `LoggingInterceptor` registra automáticamente todas las peticiones a `/countries` y `/travel-plans`. Para cada petición muestra en consola: el timestamp, el método HTTP (GET, POST, DELETE), la ruta, el código de estado y el tiempo de procesamiento en milisegundos.

