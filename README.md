# Preparcial 2 web

API REST desarrollada con NestJS para gestionar países y planes de viaje, utilizando RestCountries como fuente externa de datos de países con sistema de caché local.


## Módulos

La aplicación está organizada en los siguientes módulos:

### CountriesModule
Módulo encargado de gestionar países, utilizando datos obtenidos desde la API externa RestCountries y almacenándolos en una base de datos local como caché.


### TravelPlansModule
Módulo encargado de gestionar planes de viaje, permitiendo crear y consultar planes de viaje asociados a un país.


## Cómo ejecutar el proyecto

### Instalación

1. Clonar:
```bash
git clone https://github.com/JFH000/prep2-web
cd prep2-web
```

2. Instalar dependencias:
```bash
npm i
```


3.  Ejecutar la API

```bash
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
3. Si no existe, consulta RestCountries, guarda en la base de datos y devuelve indicando `"source": "external"` (Nota: Durante el parcial no funcionó el API)


### Módulo de Planes de Viaje (Travel Plans)

#### `POST /travel-plans`

**Body:**
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



#### `DELETE /countries/:alpha3Code`
Elimina un país de la db local. Requiere autenticación mediante header de autorización.


**Headers requeridos:**
- `Authorization: Bearer <token>`


## Extensiones de la API

En este parcial, la API fue extendida con tres funcionalidades principales que mejoran la seguridad, el control de acceso y la observabilidad del sistema. Primero, se implemento un endpoint de borrado protegido para países (`DELETE /countries/:alpha3Code`) que permite eliminar países de la caché local con validaciones que impiden el borrado si existen planes de viaje asociados. Segundo, se creó un guard de autorización (`AuthorizationGuard`) que protege operaciones sensibles verificando un token de autorización en el header de las peticiones. Tercero, se implementó un middleware de logging (`LoggingInterceptor`) que registra automáticamente todas las peticiones a las rutas principales, capturando información detallada sobre el método HTTP, la ruta, el código de estado y el tiempo de procesamiento para facilitar el monitoreo y depuración de la aplicación.


## Funcionalidades de Seguridad y Logging

### Endpoint Protegido: DELETE /countries/:alpha3Code

#### Funcionamiento

El endpoint `DELETE /countries/:alpha3Code` permite eliminar un país de la caché local después de realizar varias validaciones:

1. **Verificación de existencia**: Verifica que el país existe en la db local. Si no existe, retorna un error `404 Not Found`.

2. **Validación de dependencias**: Verifica si existen planes de viaje asociados al país. Si encuentra planes asociados, lanza un error `400 Bad Request` indicando cuántos planes están relacionados con ese país, impidiendo el borrado

3. **Autenticación**: Requiere un header `Authorization` con un token válido. El guard `AuthorizationGuard` valida el token antes de permitir la ejecución del endpoint.

4. **Eliminación**: Solo si todas las validaciones pasan, elimina el país de la base de datos y retorna `204 No Content`.


### Guard de Autorización


El `AuthorizationGuard` es un guard personalizado que implementa la interfaz `CanActivate` de NestJS. Su funcionamiento es:

1. **Extracción del header**: Obtiene el header `Authorization` de la petición HTTP.

2. **Validación de presencia**: Verifica que el header esté presente y sea una cadena válida. Si no existe o es inválido, lanza una excepción `401 Unauthorized`.

3. **Extracción del token**: Extrae el token del formato `Bearer <token>`, eliminando el prefijo "Bearer " y espacios en blanco.

4. **Validación del token**: Compara el token extraído con un token válido configurado. El token válido puede ser:
   - Definido mediante la variable de entorno `AUTHORIZATION_TOKEN`
   - O usa el valor por defecto `web-token` si no está configurada la variable de entorno

5. **Decisión de acceso**: Si el token coincide, permite el acceso (`return true`). Si no coincide, lanza `401 Unauthorized`.

El guard se aplica al endpoint `DELETE /countries/:alpha3Code` mediante el decorador `@UseGuards(AuthorizationGuard)`, asegurando que solo las operaciones de borrado requieran autenticación.

### Middleware de Logging


El `LoggingInterceptor` es un interceptor de NestJS que registra automáticamente la actividad de la API. Su funcionamiento incluye:

1. **Intercepción de peticiones**: Se ejecuta antes y después de cada petición HTTP a las rutas protegidas (`/countries` y `/travel-plans`).

2. **Medición de tiempo**: Registra el tiempo de inicio de la petición usando `Date.now()` antes de procesarla, y calcula la duración total después de completarse.

3. **Captura de información**: Extrae de cada petición:
   - **Método HTTP**: GET, POST, DELETE, etc.
   - **Ruta solicitada**: La ruta completa (ej: `/countries/JPN`, `/travel-plans`)
   - **Código de estado**: El código HTTP de la respuesta (200, 201, 404, 401, etc.)
   - **Tiempo de procesamiento**: Duración en milisegundos

4. **Manejo de errores**: También captura información de peticiones que resultan en errores, obteniendo el código de estado de la excepción HTTP.

5. **Registro en consola**: Imprime la información

El interceptor se aplica a los controladores mediante `@UseInterceptors(LoggingInterceptor)` en los controladores `CountriesController` y `TravelPlansController`, asegurando que todas las peticiones a estas rutas sean registradas.
