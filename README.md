# Preparcial 2 web

API REST desarrollada con NestJS para gestionar países y planes de viaje, utilizando RestCountries como fuente externa de datos de países con sistema de caché local.

## Descripción

Esta API permite:

- Consumir información de países desde la API externa RestCountries
- Almacenar esos países en una base de datos local a manera de caché
- Crear y gestionar planes de viaje asociados a países específicos
- Implementar arquitectura modular con separación de responsabilidades

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
git clone <url-del-repositorio>
cd prep2-web
```

2. Instalar dependencias:
```bash
npm install
```

### Configuración de la base de datos

El proyecto utiliza **SQLite** con **TypeORM** como ORM. La configuración está incluida en `src/app.module.ts`.

La base de datos se crea automáticamente al ejecutar la aplicación por primera vez. El archivo `travel-planner.db` se generará en la raíz del proyecto.

**Nota:** En producción se recomienda usar migrations en lugar de `synchronize: true`.

### Ejecutar la API

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run start:prod

# Modo estándar
npm run start
```

La API estará disponible en: `http://localhost:3000`

## Documentación de Endpoints

### Módulo de Países (Countries)

#### `GET /countries`
Lista todos los países almacenados en la base de datos.

**Respuesta exitosa (200):**
```json
[
  {
    "alpha3Code": "JPN",
    "name": "Japan",
    "region": "Asia",
    "subregion": "Eastern Asia",
    "capital": "Tokyo",
    "population": 125836021,
    "flagUrl": "https://flagcdn.com/w320/jp.png",
    "createdAt": "2025-11-18T21:00:00.000Z",
    "updatedAt": "2025-11-18T21:00:00.000Z",
    "source": "cache"
  }
]
```

#### `GET /countries/:alpha3Code`
Consulta un país por su código alpha-3.

**Parámetros:**
- `alpha3Code` (path): Código alpha-3 del país (ej: JPN, ESP, BRA)

**Comportamiento:**
1. Busca primero en la base de datos local
2. Si existe, devuelve el país indicando `"source": "cache"`
3. Si no existe, consulta RestCountries, guarda en la base de datos y devuelve indicando `"source": "external"`

**Respuesta exitosa (200):**
```json
{
  "alpha3Code": "ESP",
  "name": "Spain",
  "region": "Europe",
  "subregion": "Southern Europe",
  "capital": "Madrid",
  "population": 47351567,
  "flagUrl": "https://flagcdn.com/w320/es.png",
  "createdAt": "2025-11-18T21:00:00.000Z",
  "updatedAt": "2025-11-18T21:00:00.000Z",
  "source": "external"
}
```

**Respuesta de error (404):**
```json
{
  "statusCode": 404,
  "message": "País con código alpha-3 'XXX' no encontrado",
  "error": "Not Found"
}
```

### Módulo de Planes de Viaje (Travel Plans)

#### `POST /travel-plans`
Crea un nuevo plan de viaje.

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

**Validaciones:**
- `alpha3Code`: Requerido, exactamente 3 letras mayúsculas (ej: JPN, ESP, BRA)
- `title`: Requerido, entre 1 y 255 caracteres
- `startDate`: Requerido, formato fecha válido (YYYY-MM-DD)
- `endDate`: Requerido, formato fecha válido (YYYY-MM-DD), debe ser posterior a startDate
- `notes`: Opcional

**Respuesta exitosa (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "alpha3Code": "JPN",
  "title": "Aventura en Japón",
  "startDate": "2025-07-01",
  "endDate": "2025-07-14",
  "notes": "Visitar Tokio, Kioto y Osaka",
  "createdAt": "2025-11-18T21:00:00.000Z"
}
```

**Nota:** Si el país especificado no existe en caché, se carga automáticamente desde RestCountries antes de crear el plan.

#### `GET /travel-plans`
Lista todos los planes de viaje registrados.

**Respuesta exitosa (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "alpha3Code": "BRA",
    "title": "Explorando Brasil",
    "startDate": "2025-08-10",
    "endDate": "2025-08-25",
    "notes": "Conocer Río de Janeiro y São Paulo",
    "createdAt": "2025-11-18T21:00:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "alpha3Code": "JPN",
    "title": "Aventura en Japón",
    "startDate": "2025-07-01",
    "endDate": "2025-07-14",
    "notes": "Visitar Tokio, Kioto y Osaka",
    "createdAt": "2025-11-18T20:00:00.000Z"
  }
]
```

#### `GET /travel-plans/:id`
Consulta un plan de viaje específico por su ID.

**Parámetros:**
- `id` (path): UUID del plan de viaje

**Respuesta exitosa (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "alpha3Code": "JPN",
  "title": "Aventura en Japón",
  "startDate": "2025-07-01",
  "endDate": "2025-07-14",
  "notes": "Visitar Tokio, Kioto y Osaka",
  "createdAt": "2025-11-18T21:00:00.000Z"
}
```

**Respuesta de error (404):**
```json
{
  "statusCode": 404,
  "message": "Plan de viaje con ID 'xxx' no encontrado",
  "error": "Not Found"
}
```

## Explicación del Provider Externo

El sistema utiliza un **provider especializado** para consumir la API de RestCountries, separando la lógica de infraestructura de la lógica de negocio.

### Arquitectura

1. **Interfaz `ICountryDataProvider`**: Define el contrato que debe cumplir cualquier implementación para obtener datos de países.
2. **Implementación `RestCountriesProvider`**: Implementa la interfaz consumiendo la API de RestCountries (https://restcountries.com/v3.1).

### Ventajas

- **Desacoplamiento**: El módulo de países no depende directamente de RestCountries
- **Testabilidad**: Fácil crear mocks para pruebas
- **Flexibilidad**: Posible cambiar de proveedor sin modificar el servicio de países
- **Limitación de campos**: Solo se solicitan los campos necesarios a RestCountries (`fields=name,cca3,region,subregion,capital,population,flags`)

### Flujo de datos

```
CountriesService → ICountryDataProvider (interfaz) → RestCountriesProvider → RestCountries API
```

El provider se inyecta mediante el sistema de inyección de dependencias de NestJS usando el token `'ICountryDataProvider'`.

## Modelo de Datos

### Entidad Country

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `alpha3Code` | string (PK) | Código alpha-3 del país (ej: JPN, ESP, BRA) |
| `name` | string | Nombre del país |
| `region` | string (nullable) | Región del país |
| `subregion` | string (nullable) | Subregión del país |
| `capital` | string (nullable) | Capital del país |
| `population` | number | Población del país |
| `flagUrl` | string (nullable) | URL de la bandera del país |
| `createdAt` | Date | Fecha de creación del registro |
| `updatedAt` | Date | Fecha de última actualización |

### Entidad TravelPlan

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid (PK) | Identificador único del plan de viaje |
| `alpha3Code` | string (FK) | Código alpha-3 del país destino |
| `title` | string | Título o nombre del viaje |
| `startDate` | Date | Fecha de inicio del viaje |
| `endDate` | Date | Fecha de fin del viaje |
| `notes` | string (nullable) | Notas o comentarios opcionales |
| `createdAt` | Date | Fecha de creación del registro |

**Relación:** TravelPlan está relacionado con Country a través de `alpha3Code`.

## Pruebas Básicas Sugeridas

### 1. Consultar un país no cacheado

```bash
# Primera consulta - se carga desde RestCountries
curl http://localhost:3000/countries/JPN

# La respuesta debe incluir "source": "external"
```

### 2. Consultar un país cacheado

```bash
# Segunda consulta - se obtiene de la caché
curl http://localhost:3000/countries/JPN

# La respuesta debe incluir "source": "cache"
```

### 3. Listar todos los países

```bash
curl http://localhost:3000/countries
```

### 4. Crear un plan de viaje

```bash
curl -X POST http://localhost:3000/travel-plans \
  -H "Content-Type: application/json" \
  -d '{
    "alpha3Code": "ESP",
    "title": "Recorrido por España",
    "startDate": "2025-06-15",
    "endDate": "2025-06-30",
    "notes": "Conocer Madrid, Barcelona y Sevilla"
  }'
```

**Nota:** Si el país ESP no existe en caché, se cargará automáticamente desde RestCountries antes de crear el plan.

### 5. Listar todos los planes de viaje

```bash
curl http://localhost:3000/travel-plans
```

### 6. Consultar un plan de viaje específico

```bash
# Reemplazar {id} con el ID real obtenido en la creación
curl http://localhost:3000/travel-plans/{id}
```

### 7. Validación de errores

```bash
# País inexistente
curl http://localhost:3000/countries/XXX

# Plan de viaje inexistente
curl http://localhost:3000/travel-plans/00000000-0000-0000-0000-000000000000

# Plan con fechas inválidas
curl -X POST http://localhost:3000/travel-plans \
  -H "Content-Type: application/json" \
  -d '{
    "alpha3Code": "BRA",
    "title": "Viaje",
    "startDate": "2025-08-25",
    "endDate": "2025-08-10"
  }'
```

## Tecnologías Utilizadas

- **NestJS**: Framework Node.js progresivo
- **TypeORM**: ORM para TypeScript/JavaScript
- **SQLite**: Base de datos relacional
- **class-validator**: Validación de DTOs
- **class-transformer**: Transformación de objetos
- **axios**: Cliente HTTP para consumir RestCountries API

## Estructura del Proyecto

```
src/
├── countries/
│   ├── entities/
│   │   └── country.entity.ts
│   ├── dto/
│   │   └── country-response.dto.ts
│   ├── countries.controller.ts
│   ├── countries.service.ts
│   └── countries.module.ts
├── travel-plans/
│   ├── entities/
│   │   └── travel-plan.entity.ts
│   ├── dto/
│   │   ├── create-travel-plan.dto.ts
│   │   └── travel-plan-response.dto.ts
│   ├── travel-plans.controller.ts
│   ├── travel-plans.service.ts
│   └── travel-plans.module.ts
├── shared/
│   └── providers/
│       ├── country-data.interface.ts
│       └── rest-countries.provider.ts
├── app.module.ts
└── main.ts
```

## Desarrollo

### Scripts disponibles

```bash
# Desarrollo con hot-reload
npm run start:dev

# Compilar
npm run build

# Ejecutar en producción
npm run start:prod

# Ejecutar tests
npm run test

# Ejecutar tests e2e
npm run test:e2e

# Coverage
npm run test:cov

# Linting
npm run lint

# Formateo
npm run format
```

## Licencia

Este proyecto es parte de un preparcial académico.
