
# Cliente REST

El presente proyecto de cliente REST forma parte de una de las tareas de 
la asignatura de Acceso a Datos del Ciclo Formativo de Grado Superior de 
Desarrollo de Aplicaciones Multiplataforma. 

Básicamente se trata de crear un CRUD para usuarios, otro CRUD para libro.
Deberemos tener un servicio REST programado como un servlet Java en un contenedor Tomcat (cuidado, Tomcat no es un contenedor de EJB luego no soportará correctamente la inyección del EntityManagerFactory en las clases de los servicios), TomEE o GlashFish, contra una base de datos relacional Oracle o MySQL.

En cuanto al cliente, deberá ser en HTML5+JS (concretamente jQuery) y comunicarse con el servicio anterior en XML o en JSON.
