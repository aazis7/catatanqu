function getClientIP(req) {
  // Try multiple sources for IP address
  const forwarded = req.headers["x-forwarded-for"];
  const realIP = req.headers["x-real-ip"];
  let ip;

  if (typeof forwarded === "string") {
    // X-Forwarded-For can contain multiple IPs, take the first one
    ip = forwarded.split(",")[0].trim();
  } else if (typeof realIP === "string") {
    ip = realIP;
  } else {
    // Fallback to Express's req.ip
    ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      "unknown";
  }

  // Clean up IPv6 mapped IPv4 addresses
  if (ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }

  return ip;
}

function getUserAgent(req) {
  const userAgent = req.get("User-Agent") || req.headers["user-agent"];
  return typeof userAgent === "string" ? userAgent : "unknown";
}

export function getClientInfo(req) {
  return {
    ipAddress: getClientIP(req),
    userAgent: getUserAgent(req),
    referer: req.get("Referer") || "unknown",
    acceptLanguage: req.get("Accept-Language") || "unknown",
  };
}
