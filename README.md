# MediLink-Frontend-Angular

Interfaz web del sistema de gestión de citas médicas MediLink, desarrollada con Angular y conectada a un backend de microservicios mediante API Gateway.

Permite administrar pacientes, médicos, citas, usuarios, notificaciones y reportes según el rol de la cuenta autenticada.

## 1. Tecnologías

- Angular 17.
- TypeScript.
- HTML y SCSS.
- Angular Router.
- Angular Forms.
- HttpClient y RxJS.
- Bootstrap y sus iconos.
- Material Icons.
- Node.js y npm.

Las versiones exactas de las dependencias están definidas en `package.json` y `package-lock.json`.

## 2. Repositorios

Frontend:

https://github.com/Alexan-22/MediLink-Frontend-Angular

Backend:

https://github.com/Alexan-22/MediLink-Backend-Microservices

## 3. Requisitos

- Node.js compatible con la versión de Angular del proyecto.
- npm.
- Git.
- Backend de MediLink configurado y ejecutándose.
- Visual Studio Code u otro editor.

Verificar las herramientas:

```powershell
node --version
npm --version
git --version
```

No es necesario instalar Angular CLI globalmente: se puede utilizar `npx ng`.

## 4. Descargar el proyecto

```powershell
git clone https://github.com/Alexan-22/MediLink-Frontend-Angular.git
cd MediLink-Frontend-Angular
```

Si GitHub solicita autenticación, utilizar una cuenta con acceso al repositorio.

## 5. Instalar dependencias

Cuando existe `package-lock.json`, instalar las versiones registradas:

```powershell
npm ci
```

Para una instalación que requiera actualizar el archivo de dependencias:

```powershell
npm install
```

No es necesario reinstalar las dependencias en cada arranque.

## 6. Configurar la conexión con el backend

Revisar:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

La propiedad `apiUrl` debe apuntar al API Gateway.

Ejemplo para desarrollo:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

Conservar las demás propiedades que pueda utilizar el proyecto.

El frontend consulta el Gateway; no necesita conectarse directamente a los puertos de cada microservicio.

Las variables incluidas en Angular son visibles para el navegador. No colocar contraseñas de base de datos, JWT_SECRET ni claves internas del backend en estos archivos.

## 7. Levantar el backend

Antes de probar las funciones del frontend, iniciar:

| Componente | Puerto |
|---|---:|
| Eureka Server | 8761 |
| Auth Service | 8081 |
| Patient Service | 8082 |
| Doctor Service | 8083 |
| Notification Service | 8085 |
| Appointment Service | 8084 |
| Report Service | 8086 |
| API Gateway | 8080 |

Las instrucciones y variables necesarias están en el README del backend:

https://github.com/Alexan-22/MediLink-Backend-Microservices

Comprobar el registro de los servicios en:

```text
http://localhost:8761
```

## 8. Ejecutar el frontend

Desde la carpeta del proyecto:

```powershell
npx ng serve --open
```

Dirección local:

```text
http://localhost:4200
```

Ejemplo con la ruta local utilizada durante el desarrollo:

```powershell
cd "C:\Users\alexa\Downloads\Informe Final proyecto Medicitas\mediLink-frontend"
npx ng serve --open
```

Mantener la terminal abierta mientras se utiliza la aplicación.

La configuración local del Gateway permite solicitudes desde `http://localhost:4200`.

## 9. Estructura principal

| Carpeta | Contenido |
|---|---|
| src/app/core/guards | Protección de rutas y roles |
| src/app/core/interceptors | Manejo de solicitudes o errores HTTP |
| src/app/core/models | Modelos y DTO del frontend |
| src/app/core/services | Servicio de almacenamiento del token |
| src/app/features/auth | Inicio de sesión y registro |
| src/app/features/dashboard | Panel principal por rol |
| src/app/features/patients | Gestión de pacientes |
| src/app/features/doctors | Gestión de médicos |
| src/app/features/appointments | Citas y consultas personales |
| src/app/features/notifications | Administración de notificaciones |
| src/app/features/reports | Reportes |
| src/app/features/users | Gestión de usuarios y contraseñas |
| src/app/features/profile | Perfil de la cuenta |
| src/app/services | Servicios HTTP |
| src/app/shared/components | Cabecera, menú y componentes compartidos |
| src/assets/images | Recursos gráficos y logo |
| src/environments | Configuración de conexión |

El archivo `arbol_directorios.txt`, cuando está actualizado, contiene el listado detallado de archivos.

## 10. Autenticación

La aplicación permite:

- Iniciar sesión con usuario y contraseña.
- Registrar una cuenta de paciente.
- Acceder a las funciones autorizadas para el rol.
- Consultar Mi perfil.
- Cerrar sesión.

El backend devuelve el token JWT y los datos básicos de la cuenta.

Las peticiones protegidas deben enviar:

```http
Authorization: Bearer TU_TOKEN
```

El frontend utiliza el token para acceder al backend. Las claves internas de comunicación entre microservicios permanecen fuera del navegador.

No se incluyen credenciales reales en este repositorio.

## 11. Roles y funciones

### Administrador

- Consultar el panel general.
- Administrar pacientes y médicos.
- Gestionar citas.
- Administrar notificaciones.
- Consultar reportes.
- Crear y actualizar usuarios.
- Cambiar contraseñas.
- Vincular una cuenta MEDICO con su ficha médica.

### Recepcionista

- Consultar el panel de recepción.
- Registrar y editar pacientes.
- Consultar médicos.
- Registrar y editar citas programadas.
- Cancelar citas y registrar inasistencias.

No dispone de administración de usuarios, reportes o notificaciones en el menú.

No puede modificar médicos, eliminar pacientes o citas ni marcar citas como atendidas.

### Médico

- Consultar su perfil médico vinculado.
- Consultar el resumen de sus citas.
- Ver las citas asignadas a su ficha.
- Atender o registrar inasistencia en citas propias, según el estado.

No dispone del listado general de notificaciones ni de estadísticas generales del sistema.

### Paciente

- Consultar su información personal.
- Completar su ficha si todavía no está vinculada.
- Consultar sus propias citas.
- Acceder a Mi perfil.

El registro de una cuenta no crea automáticamente una cita.

### Enfermera

- Acceder al panel y a las opciones de pacientes y citas habilitadas para su rol.
- Consultar la información permitida por el backend.

Los permisos efectivos de cada operación dependen de las reglas del backend.

## 12. Registro y vinculación de cuentas

### Registro público

El formulario de registro está destinado a pacientes.

Los roles administrativos y del personal se gestionan desde Usuarios mediante una cuenta ADMIN.

### Ficha del paciente

Si la cuenta PACIENTE no tiene una ficha vinculada:

1. Iniciar sesión.
2. Abrir Mi perfil.
3. Completar los datos solicitados.
4. Guardar.

El backend utiliza el usuario del token para vincular la ficha. No se vincula automáticamente una ficha existente solo por ingresar el mismo DNI.

### Ficha médica

El administrador:

1. Crea una cuenta de rol MEDICO.
2. Registra o edita la ficha del médico.
3. Vincula la cuenta con esa ficha.

Después, el médico puede consultar su perfil y sus citas propias.

## 13. Rutas principales

| Ruta | Pantalla |
|---|---|
| /auth/login | Inicio de sesión |
| /auth/register | Registro de paciente |
| /dashboard | Panel según el rol |
| /profile | Mi perfil |
| /patients | Pacientes |
| /patients/new | Registrar paciente |
| /patients/edit/:id | Editar paciente |
| /patients/view/:id | Detalle del paciente |
| /doctors | Médicos |
| /doctors/new | Registrar médico |
| /doctors/edit/:id | Editar médico |
| /doctors/view/:id | Detalle del médico |
| /appointments | Listado de citas según el rol |
| /appointments/new | Registrar cita |
| /appointments/edit/:id | Editar cita |
| /appointments/view/:id | Detalle de cita |
| /appointments/calendar | Calendario de citas |
| /appointments/me | Citas del paciente |
| /notifications | Notificaciones |
| /reports | Reporte general |
| /reports/appointments | Reporte de citas |
| /reports/patients | Reporte de pacientes |
| /reports/doctors | Reporte de médicos |
| /users | Administración de usuarios |

La disponibilidad de una ruta depende del rol y de las reglas de navegación.

El calendario y cualquier ruta secundaria deben conservar las mismas restricciones de acceso que el resto del módulo.

## 14. Módulos funcionales

### Pacientes

Consulta de pacientes, registro, edición y detalle. Los botones de eliminación están restringidos al administrador.

### Médicos

Consulta de especialidad, CMP, teléfono, correo, consultorio, horario y estado.

La creación, edición, vinculación de usuarios y eliminación corresponden al administrador.

### Citas

Permite seleccionar paciente, médico, fecha y horario disponible.

Estados utilizados:

```text
PROGRAMADA
ATENDIDA
CANCELADA
NO_ASISTIO
```

Las acciones visibles dependen del rol y del estado de la cita.

El médico consulta sus citas mediante:

```text
GET /appointments/medico/me
```

El paciente consulta las suyas mediante:

```text
GET /appointments/me
```

### Reportes

Incluye vistas de resumen general, citas, pacientes y médicos.

El backend proporciona totales generales, registros activos y cantidades de citas por estado.

### Usuarios

Permite al administrador gestionar cuentas y roles, además de cambiar contraseñas.

Las contraseñas existentes no se consultan ni se muestran. Los controles para mostrar contraseña solo cambian la visibilidad del valor que se está escribiendo.

### Perfil

- ADMIN: datos de la cuenta.
- MEDICO: cuenta y ficha médica vinculada.
- PACIENTE: cuenta, ficha personal o formulario para completarla.

## 15. Diseño adaptable

La interfaz incorpora:

- Cabecera con el logo de MediLink.
- Identificación del usuario y su rol.
- Menú lateral según permisos.
- Menú adaptable para pantallas pequeñas.
- Formularios y tarjetas con ajustes para móvil.
- Tablas con contenedores de desplazamiento donde estén implementados.

La revisión completa en distintos tamaños de PC, tableta y móvil forma parte de las comprobaciones pendientes.

Logo principal:

```text
src/assets/images/medilink-logo.png
```

## 16. Seguridad

El frontend utiliza guards y visibilidad condicional para orientar la navegación según el rol.

La autorización real se verifica en el backend. Ocultar un botón no sustituye la protección de su endpoint.

Las consultas de pacientes, médicos, usuarios, notificaciones y reportes requieren autenticación y permisos en el backend.

El manejo de errores distingue situaciones como:

| Código | Situación |
|---|---|
| 400 | Datos incorrectos |
| 401 | Sesión no válida o falta de autenticación |
| 403 | Operación no autorizada |
| 404 | Recurso o ficha no encontrada |
| 409 | Conflicto de datos o estado |
| 500 | Error interno que requiere revisión |

## 17. Comprobaciones manuales

Antes de una entrega:

1. Iniciar sesión con cada rol.
2. Comprobar que el menú corresponda a la cuenta.
3. Probar el acceso directo a rutas no autorizadas.
4. Registrar y editar pacientes con una cuenta permitida.
5. Verificar el rechazo de DNI duplicados.
6. Consultar médicos como Recepcionista y administrarlos como ADMIN.
7. Revisar la vinculación de la cuenta médica.
8. Crear una cita en un horario disponible.
9. Comprobar los cambios de estado autorizados.
10. Verificar que Médico y Paciente solo consulten sus citas.
11. Revisar los reportes como ADMIN.
12. Probar cierre de sesión y sesión vencida.
13. Revisar formularios, menú y tablas en tamaños de móvil y tableta.

Utilizar datos ficticios para las pruebas.

## 18. Compilar

Desde la carpeta del frontend:

```powershell
npx ng build
```

Para la configuración de producción, si está definida en `angular.json`:

```powershell
npx ng build --configuration production
```

Los archivos generados se ubican en la ruta de salida definida por `angular.json`.

La compilación prepara el frontend; no publica automáticamente la aplicación ni despliega los microservicios.

## 19. Problemas frecuentes

### No conecta con el backend

Comprobar:

- API Gateway activo en el puerto 8080.
- Microservicios registrados en Eureka.
- Valor de `environment.apiUrl`.
- Configuración CORS.
- Conexión de los servicios a PostgreSQL.

### Error 401

La sesión puede haber vencido o la solicitud puede no incluir un token válido.

Volver a iniciar sesión y revisar el envío del encabezado Authorization.

### Error 403

La cuenta no tiene permiso para la operación o intenta acceder a una cita ajena.

No eliminar la protección del backend para resolver este error.

### Mi perfil no muestra una ficha

Comprobar la vinculación de la cuenta.

El paciente puede completar su ficha desde Mi perfil. El médico requiere vinculación por parte del administrador.

### Pantalla vacía o fallo de compilación

Revisar la terminal de Angular y la consola del navegador.

Comprobar imports, declaraciones de módulos, plantillas, rutas y métodos de los servicios.

### Puerto 4200 ocupado

Revisar si Angular ya está ejecutándose en otra terminal.

```powershell
netstat -ano | findstr :4200
```

### Problemas con la caché de Angular

Detener Angular y ejecutar:

```powershell
npx ng cache clean
npx ng serve --open
```

La carpeta `.angular/` está excluida del repositorio y se genera localmente.

## 20. Detener el frontend

En la terminal de Angular:

```text
Ctrl + C
```

## 21. Cambios incorporados

- Identidad visual de MediLink y logo.
- Cabecera y menú adaptables.
- Menús y botones según el rol.
- Restricciones de Recepcionista.
- Perfil personal de paciente.
- Perfil médico vinculado.
- Consultas de citas propias.
- Resumen del médico basado en sus citas.
- Gestión de usuarios y contraseñas.
- Vistas de reportes.
- Limpieza de la caché de Angular del repositorio.

## 22. Pendientes

- Completar la revisión adaptable de todas las pantallas.
- Ampliar las pruebas de rutas y permisos de todos los roles.
- Revisar el comportamiento del frontend ante fallos de servicios.
- Incorporar búsquedas, filtros o paginación donde sean necesarios.
- Corregir en el backend la respuesta 500 de la prueba de reservas simultáneas y comprobar el manejo de HTTP 409.

El backend ya incorpora un índice para evitar reservas duplicadas, pero la traducción del conflicto a HTTP 409 sigue pendiente de verificación.

No publicar tokens, credenciales ni datos personales reales.









