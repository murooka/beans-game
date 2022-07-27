import Cookies from "js-cookie";

import { createRandomString } from "./data";

const anonymousUserIdKey = "aid";

export const getOrCreateAnonymousPlayerId = (): string => {
  const saved = Cookies.get(anonymousUserIdKey);
  if (saved != null) return saved;

  const created = createRandomString();
  Cookies.set(anonymousUserIdKey, created);
  return created;
};
