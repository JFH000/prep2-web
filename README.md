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


**Funcionamiento:**
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
  "message": "Plan de viaje con ID '...' no encontrado",
  "error": "Not Found"
}
```
