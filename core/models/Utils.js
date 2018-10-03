const jwt = require("jsonwebtoken");

module.exports = {
  api: {
    "constants": [
      async (ctx) => {
        ctx.body = `window.inventroomConstants = ${ JSON.stringify(UtilService.constants) };`;
      }
    ]
  }
};
