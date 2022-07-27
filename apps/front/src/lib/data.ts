import { customAlphabet } from "nanoid";

export const firstOrNull = (
  value: string | string[] | null | undefined
): string | null => {
  if (value == null) return null;
  return Array.isArray(value) ? value[0] : value;
};

const nanoid = customAlphabet("0123456789abcdef");
export const createRandomString = (): string => {
  return nanoid();
};
