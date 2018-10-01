const config = require("config");
const App = require(__dirname + "/core/classes/App");

global.inventroom = new App();
inventroom.listen(config.get("port"));

inventroom.init()
  .then(() => {
    inventroom.logger.info("==========================================");
    inventroom.logger.info(`${config.get("title")} application started`);
    inventroom.logger.info(`Port: ${config.get("port")}`);
    inventroom.logger.info(`Environment: ${config.util.getEnv("NODE_ENV")}`);
    inventroom.logger.info("==========================================");
  })
  .catch((err) => {
    inventroom.logger.error("Failed to start");
    inventroom.logger.error(err);
    process.exit();
  });
