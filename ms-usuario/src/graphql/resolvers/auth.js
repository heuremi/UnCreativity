import axios from 'axios';


const query = `
query {
  clientes {
    email
    clave
  }
}

`;

// Hacer la solicitud POST con Axios
axios.post('http://localhost:3002/graphql/usuario', {
  query: query,
})
  .then((response) => {
    console.log('Respuesta:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
