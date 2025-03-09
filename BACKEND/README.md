# SGE (Sistema de Gestor de Empleados).

# Dependencias instaladas en Backend

- npm install mongoose
- npm install express cors dotenv
- npm install express-validator
- npm install bcryptjs
- npm install multer


# Configurado como Standalone para FontEnd

## Estructura del proyecto.

```
BACKEND/
│
├── config/             # Configuraciones (base de datos, etc)
├── controllers/        # Contiene la lógica de negocio principal, como operaciones CRUD (manejan la lógica de las rutas)
├── middlewares/        # Middlewares (autenticación, validación, etc.)
├── models/             # Modelos (Define la estructura de los datos y cómo interactuar con la base de datos.)
├── routes/             # Rutas (Definen los endpoints de la API y asocia cada ruta con un controlador.)
├── services/           # Servicios ( Contiene funciones reutilizables que pueden ser usadas por múltiples controladores)
├── utils/              # Utilidades (funciones helper, validaciones, handdle, etc.)
|
├── index.js            # Configuración de la app Express
└── server.js           # Inicio del servidor
│
├── .env                # Variables de entorno
├── .gitignore          # Archivo para ignorar archivos en Git
├── package.json        # Dependencias y scripts
└── README.md           # Documentación del proyecto
```

