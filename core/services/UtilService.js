const config = require("config");

module.exports = {
  constants: {
    vkAppId: config.get("vk.appId")
  }
};
