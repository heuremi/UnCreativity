Les sugiero ver esto con la pestaña <code> pero las imagenes se ven en el preview

Para iniciar el proyecto deben clonar el repositorio a una carpeta local, la que eligan

-Abrir la consola/terminal es su ide o cmd

-Asegurarse que la ruta este en ..\UnCreativity>

-Hacer npm init

-Hacer npm start

les debería salir el mensaje "starting `node app.js`"

Registro/Búsqueda de usuarios

En su navegador ingresen a localhost:3000/graphql
esta es una consola de querys de graphql

Las querys son del tipo

{
  query/mutation {
    endpoint {
      request files
      name
      pass
    }
  }
}

Los usuarios tienen los atributos -id, name, password, age, email, phone, el endpoint de estos es /users

Query para ver usuarios

![image](https://github.com/user-attachments/assets/63c13cd2-8abf-4a2b-868d-0361cdfe5cd2)

Query para registrar usuarios

![image](https://github.com/user-attachments/assets/544e6f39-0cfb-4502-8771-6fbbe3da12ae)
