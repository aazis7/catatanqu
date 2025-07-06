export function generateAvatarUrl(userName) {
  if (!userName) throw new Error("Username is required");

  const seed = userName.trim();
  const initial = seed.charAt(0).toUpperCase();

  const hue = hashString(seed) % 360;
  const bgColor = hslToHex(hue, 80, 75).slice(1);

  const params = new URLSearchParams({
    seed,
    text: initial,
    size: "128",
    radius: "50",
    backgroundColor: bgColor,
  });

  return `https://api.dicebear.com/9.x/initials/webp?${params}`;
}
function hashString(str) {
  return Array.from(str).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    Math.round(
      255 * (l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1))),
    );
  return `#${[f(0), f(8), f(4)].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
