const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = {
  api: {
    "auth/me": [

    ],
    "auth/vk:code": [
      async (ctx) => {
        const code = ctx.params.code.replace(/^\:/, "");
        const token = await AuthService.getJWTByVKCode(code, ctx.query.redirectURI);
        const tokenData = jwt.decode(token);

        ctx.cookies.set("jwt", token, {
          expires: new Date((tokenData.exp - config.get("jwt.lifetimeCookiePadding")) * 1000),
          overwrite: true,
          httpOnly: false
        });

        ctx.body = { token };
      }
    ]
  }
};
