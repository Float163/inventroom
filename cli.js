const config = require("config");
const App = require(__dirname + "/core/classes/App");
const minimist = require("minimist");

global.inventroom = new App();
inventroom.init()
  .then(async () => {
    const argv = minimist(process.argv.slice(2));
    const commandsHash = {
      async init_db() {
        inventroom.logger.error("Not implemented yet");
      },
      get_sql() {
        inventroom.logger.error("Not implemented yet");
      },
      create_operator() {
        inventroom.logger.error("Not implemented yet");
      }
    };

    const command = argv._[0];
    if (!command || command === "help") {
      return inventroom.logger.info(`Possible commands are: ${Object.keys(commandsHash).join(", ")}`);
    }

    if (!commandsHash[command]) {
      return inventroom.logger.error(`Command ${command} not found. Run with --help option to see the list of available commands.`);
    }
    await commandsHash[command]();
  })
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    inventroom.logger.error("An error occured!", err);
    process.exit();
  });
