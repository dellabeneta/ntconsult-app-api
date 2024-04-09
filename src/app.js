const mongoose = require('mongoose');
const { stringConnection } = require('./database/config');
const app = require("./server");

mongoose.connect(stringConnection);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  /* eslint-disable-next-line no-console */
  console.log(`Servidor rodando na porta ${PORT}`);
  /* eslint-disable-next-line no-console */
  console.log(process.env.NODE_ENV);
});
