require('dotenv').config();

let stringConnection;

if (process.env.NODE_ENV === 'dev') {
  stringConnection = process.env.DB_URI_DEV;
} else {
  stringConnection = process.env.DB_URI_PRD;
}

module.exports = {
  stringConnection,
};
