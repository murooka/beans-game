type AppEnv = "local" | "prod";
const mustAppEnv = (e: string | undefined): AppEnv => {
  if (e === "local") return e;
  if (e === "prod") return e;

  throw new Error(`unknown APP_ENV: ${e}`);
};

const APP_ENV = mustAppEnv(process.env.APP_ENV);

export const config = {
  local: {
    WEB_ORIGIN: "http://localhost:3000",
  },
  prod: {
    WEB_ORIGIN: "https://bp-game.web.app",
  },
}[APP_ENV];
