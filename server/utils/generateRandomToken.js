function generateRandomToken() {
  // Generate random 6-digit number
  const token = Math.floor(Math.random() * 900000) + 100000;
  return token.toString();
}
