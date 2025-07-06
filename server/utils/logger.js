import { createConsola } from "consola";

const isDev = process.env.NODE_ENV === "development";

export const logger = createConsola({
  level: isDev ? 4 : 3,
  fancy: isDev ? true : false,
});
