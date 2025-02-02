const app = require('./app.js');
const config = require('./utils/config.js');

app.listen(config.serverPort, () => {
  console.log(`Server is listening on port ${config.serverPort}`);
});
