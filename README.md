# Proyects Challenge — README

## 2️⃣ README (Obligatorio)

Este repositorio contiene un backend (Express + Sequelize +SQLite + TypeScript) y un frontend (React + Vite + Material UI|). A continuación se explica cómo ejecutar el proyecto, las decisiones técnicas tomadas y sugerencias de mejora.

---

### 🔹 Cómo ejecutar el proyecto

Requisitos locales:
- Node.js 16+ (recomendado 18+)
- npm

1) Instalar dependencias

- Backend
  ```bash
  cd proyects-challenge/backend
  npm install
  ```

- Frontend
  ```bash
  cd ../frontend
  npm install
  ```

2) Poblar la base de datos (seed)

- Desde la carpeta `backend`:
  ```bash
  npm run seed
  ```
  Esto crea algunos proyectos y trabajadores de ejemplo y asigna trabajadores a proyectos. La base de datos es un archivo local que se crea  en `backend/db/database.sqlite`.

3) Levantar backend en modo desarrollo

- Desde `backend`:
  ```bash
  npm run dev
  ```
  - El servidor por defecto escucha en http://localhost:3000 y expone la API en `/api`.
  
4) Levantar frontend en modo desarrollo

- Desde `frontend`:
  ```bash
  npm run dev
  ```
  - El frontend por defecto arranca con Vite (ej. http://localhost:5173). 

### 🔹 Decisiones técnicas
  - Se separó  frontend y backend  como proyectos independientes por las diferentes dependencias de cada uno.
  - Se ocuparon componentes de material UI y un ORM  como Sequelize para un prototipado más rápido

- Prioridades de implementación:
    La prioridad implementar fue implementar las funcionalidades requeridas para el proyecto.Para esto el orden en el desarrollo fue el sgte:
     - Decisión de stack tecnológico a ocupar.
     - configuracion de stack tecnologico
     - Modelado de datos pensando en la funcionalidades requeridas
     - endpoints pensando en las funcionalidades requeridas
     - desarrollo de UI
    
- Qué se dejó fuera:
   - No se hace validación de datos  en front y back, para efectos de una prueba técnica y para cuidar el tiempo de desarrollo se decide que queda fuera de alcance .

   - El proyecto se testeo solo en forma de desarrollo (por ejemplo no intenté hacer el build  del frontend), solo se probó que las funcionalidades requeridas funcionaran correctamente en modo desarrollo y se subió.

   - Una buena idea que tenía considerada es  dockerizar el proyecto para facilitar la portabilidad, hacerlo  me dejaba ya fuera de los limites de  tiempo. Además dejé dentro del codigo variables  que dependen  del ambiente (p. ej. `BACKEND_URL`,`PORT` ) como fijas, si bien esto sirve se pueden inyectar desde  varieables de entorno.

### 🔹 Mejoras futuras (si hubiera más tiempo)
    - La implementacion de los aspectos que se dejaron fuera mencionados:
        - La validación de datos se puede hacer con Zod y se puede  mejorar la UI  para mostrar validaciones del frontend
        - La portabilidad  del repo  puede asegurarse con docker, sería  hacer  un docker-compose file y en este caso asegurarse de usar variables de ambiente

### Explicación conceptual 
    Responde brevemente:
    1. ¿Cómo escalarías este sistema si tuviera 10.000 proyectos?
    Una motor de  bases de datos relacional  debería ser suficiente para esa cantidad de datos. Lo que se tendría que hacer es  migrar el sistema a Postgres (el ORM  facilitaría  esta migración). En el caso  en que aún no sea performante se pueden indexar las tablas  necesarias (p. ej. la tabla de asignaciones de trabajadores a proyectos) con esto el sistema debería funcionar bien.

    2. ¿Qué cambiarías si múltiples usuarios lo usaran al mismo tiempo?
    - Hay que definir qué significa usarlo al mismo tiempo, si lo que se quiere es  interactividad  (p. ej  ver que está editando  un usuario , como  en google docs) se posrían usar websockets  para una solucion de este tipo. 
    -Si lo que se quiere es asegurar la integridad  de una  operacion compleja se puede usar  transacciones en sql.
    - Si lo que se quiere es diminuir la carga  en el servidor se pueden deployar varias instancias  de este y mediante un load balancer distribuirlas (con nginx  por ejemplo).
    3. ¿Cómo agregarías permisos por rol?
    Se debe  primero idear una forma de autenticación  por usuario esto puede ser mediante JWT o Session tokens, una vez un usuario es identificado se le puede asignar un rol (p. ej. admin, user) y en base a eso definir qué acciones puede realizar (que  endpoints  puede ejecutar).
    Express es una librería para construir apis, no tiene una solución de autenticación integrada, pero se pueden usar middlewares como `passport` para implementar esta funcionalidad.Se puede optar por frameworks  más  completos  como Nest  para tener esto  de antemano.
    No necesitas implementarlo, solo explicarlo.


