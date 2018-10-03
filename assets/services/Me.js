const jwt = require("jsonwebtoken");
const cookie = require("cookie");
import { omit } from "lodash";

const extractStateFromCookie = () => {
  if (typeof window === "undefined") { return null; }
  try {
    const token = jwt.decode(cookie.parse(document.cookie).jwt);
    return {
      exp: token.exp,
      ...(omit(token, "exp", "iat"))
    }
  } catch(err) {
    return null;
  }
};

export const meReducer = (state = extractStateFromCookie(), action) => {
  switch (action && action.type) {
    case "me:refresh":
      return extractStateFromCookie();
  }
  return state;
};

export const meSelector = (state) => {
  if (!state.me) { return false; }
  if (state.me.exp * 1000 < new Date().getTime()) { return false; }
  return state.me;
};

export const meRefresh = () => ({
  type: "me:refresh"
});
