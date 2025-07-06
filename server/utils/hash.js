import bcrypt from "bcryptjs";

export const hash = async (payload) =>
  bcrypt.hash(payload, Number(process.env.GEN_SALT) || 10);
export const compare = async (payload, hashed) =>
  bcrypt.compare(payload, hashed);
