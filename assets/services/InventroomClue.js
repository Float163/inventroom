import ReduxClue, { Clue as rClue, queries as rQueries} from "redux-clue";

export default ReduxClue({
  storeKey: "InventroomClue",
  apiPrefix: "api",
  apiPluralize: false,
  idAttribute: "id",
  models: [
    "user", "session", "auth"
  ]
});

export const queries = rQueries;
export const Clue = rClue;
