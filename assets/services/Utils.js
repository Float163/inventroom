export function parseSearchHash(search) {
  return String(search).replace(/^\?/, "").split("&").reduce(
    (memo, pairString) => {
      const pair = pairString.split("=");
      memo[pair[0]] = pair[1];
      return memo;
    },
    {}
  );
}
