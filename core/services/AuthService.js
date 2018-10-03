const config = require("config");
const request = require("request-promise");
const jwt = require("jsonwebtoken");

module.exports = {
  async getJWTByVKCode(code, redirectURI) {
    const tokenInfo = await module.exports._vkGetTokenInfo(code, redirectURI);
    const user = await module.exports._getUserByVKTokenInfo(tokenInfo);
    return jwt.sign(
      _.pick(user, "id", "name", "avatar", "vkId"),
      config.get("jwt.secret"),
      {
        // expiresIn: tokenInfo.expires_in
        expiresIn: config.get("jwt.lifetime")
      }
    );
  },

  /**
   * @typedef {Object} VKTokenInfo
   * @property {string} token
   * @property {number} expires_at - expiration timestamp in seconds
   * @property {number} expires_in - ttl in seconds
   * @property {number} user_id
   */

  /**
   * Gets token info from vk
   * @param code
   * @param redirectURI
   * @returns { VKTokenInfo }
   * @private
   */
  async _vkGetTokenInfo(code, redirectURI) {
    const hash = {
      client_id: config.get("vk.appId"),
      client_secret: config.get("vk.secret"),
      redirect_uri : redirectURI,
      code
    };
    const search = _.reduce(
      { ...hash, v: config.get("vk.v") },
      (memo, v, k) => `${memo}${memo ? "&" : ""}${k}=${v}`,
      ""
    );
    const response = await request(`https://oauth.vk.com/access_token?${search}`);
    const data = JSON.parse(response);

    return data;
  },

  async _vkRequest(methodName, parametersHash, token) {
    const search = _.reduce(
      { ...parametersHash, access_token: token, v: config.get("vk.v") },
      (memo, v, k) => `${memo}${memo ? "&" : ""}${k}=${v}`,
      ""
    );
    const response = await request(`https://api.vk.com/method/${methodName}?${search}`);

    return JSON.parse(response).response;
  },

  async _getUserByVKTokenInfo(tokenInfo) {
    const users = await inventroom.db.find("user", { vkId: tokenInfo.user_id }, { limit: 1 });
    if (users.length > 0) {
      return users[0];
    }
    const vkUsersInfo = await module.exports._vkRequest(
      "users.get",
      {
        user_ids: tokenInfo.user_id,
        fields:
        "photo_id, verified, sex, bdate, city, country, home_town, has_photo, photo_50, photo_100, photo_200_orig, " +
        "photo_200, photo_400_orig, photo_max, photo_max_orig, online, domain, has_mobile, contacts, site, " +
        "education, universities, schools, status, last_seen, followers_count, common_count, occupation, nickname, " +
        "relatives, relation, personal, connections, exports, wall_comments, activities, interests, music, movies, " +
        "tv, books, games, about, quotes, can_post, can_see_all_posts, can_see_audio, can_write_private_message, " +
        "can_send_friend_request, is_favorite, is_hidden_from_feed, timezone, screen_name, maiden_name, crop_photo, " +
        "is_friend, friend_status, career, military, blacklisted, blacklisted_by_me."
      },
      tokenInfo.access_token
    );
    const vkInfo = vkUsersInfo[0];

    const newUser = await inventroom.db.insert("user", {
      vkId: tokenInfo.user_id,
      name: `${vkInfo.first_name} ${vkInfo.last_name}`.trim() || vkInfo.nick_name || vkInfo.screen_name,
      avatar: vkInfo.photo_50,
      customInfo: vkInfo
    });

    return newUser;
  }
};
