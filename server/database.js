const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    password: "JRG666JRG",
    host: "localhost",
    port: 5432
})

pool.query("CREATE DATABASE users").then((response ) => {
    console.log(response);
})
.catch((err) => {
    console.error(err);
});

module.exports = pool;