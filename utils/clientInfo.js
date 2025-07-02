// utils/clientInfo.js
import {UAParser} from "ua-parser-js";

export const getClientInfo = (userAgent) => {
  const parser = new UAParser(userAgent);
  const ua = parser.getResult();
  return {
    browser: ua.browser.name || "Unknown",
    os: ua.os.name || "Unknown",
    deviceType: ua.device.type || "Desktop",
  };
};
