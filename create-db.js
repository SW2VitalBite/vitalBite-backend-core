const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:alvarorionuevo15@localhost:5432/postgres'
});
client.connect().then(() => {
  client.query('CREATE DATABASE spring_documentos;').then(() => {
    console.log('Database created');
    process.exit(0);
  }).catch(e => {
    console.log(e);
    process.exit(1);
  });
});
