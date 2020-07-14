const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "Mandy@$7",
  database: "strivelive",
});
module.exports = {
  query: (text, params) => pool.query(text, params),
};
