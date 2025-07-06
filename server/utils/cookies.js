import { fifteenMinutesFromNow, sevenDaysFromNow } from "./formatDate.js";

const accessTokenCookieOpts = {
  secure: process.env.NODE_ENV === "development",
  sameSite: "lax",
  httpOnly: true,
  expires: fifteenMinutesFromNow(),
};

const refreshTokenCookieOpts = {
  secure: process.env.NODE_ENV === "development",
  sameSite: "lax",
  httpOnly: true,
  expires: sevenDaysFromNow(),
};

export const sendCookies = (res, accessToken, refreshToken) => {
  res
    .cookie("accessToken", accessTokenCookieOpts, accessToken)
    .cookie("refreshToken", refreshTokenCookieOpts, refreshToken);
};
