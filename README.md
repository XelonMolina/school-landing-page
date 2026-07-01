# Sistema de Gestión Escolar

Plataforma integral desarrollada para la administración académica, gestionando estudiantes, asistencia, calificaciones y una biblioteca digital. 

## 🚀 Tecnologías Utilizadas

* **Frontend:** Angular
* **Backend:** Node.js 
* **Bases de Datos:** MySQL (Datos relacionales) y MongoDB (Documentos)
* **Infraestructura:** Docker y Docker Compose

## ⚙️ Requisitos Previos

Para ejecutar este proyecto de forma local, asegúrate de tener instalado:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) (o el motor de Docker en Linux)
* [Git](https://git-scm.com/)

## 🛠️ Instalación y Ejecución

1. Clona este repositorio en tu máquina local:

       git clone https://github.com/XelonMolina/school-landing-page

2. Navega al directorio del proyecto:

       cd paginaweb-colegio

3. Levanta la infraestructura completa (Frontend, Backend y Bases de Datos) utilizando Docker. Este comando construirá las imágenes, aplicará el archivo init.sql y cargará los datos semilla (seed):

       docker compose up -d --build

4. Una vez que los contenedores estén en ejecución, accede a la aplicación desde tu navegador en:
   **http://localhost:8080**

> **Nota:** Si necesitas reiniciar la base de datos desde cero para recargar el seed, utiliza `docker compose down -v` antes de volver a levantar los contenedores.

## 🔐 Credenciales de Acceso (Entorno de Prueba)

El sistema incluye usuarios preconfigurados para probar los distintos roles. La contraseña para todas las cuentas es: **123456**

| RUT | Rol / Usuario |
| :--- | :--- |
| `11111111-1` | **Admin** (Administrador del Sistema) |
| `22222222-2` | **Teacher** (Profesor / Staff) |
| `33333333-3` | **Student** (Juan Pérez) |
| `44444444-4` | **Student** (Ana López) |
| `55555555-5` | **Student** (Carlos Muñoz) |

## 👨‍💻 Autor

* **Vicente Delgado Molina** - Estudiante de Informática, Universidad Católica de la Santísima Concepción (UCSC) - [Perfil de GitHub](https://github.com/XelonMolina)
