import { asyncController } from "../utils/asyncController.js";

export const login = asyncController(async (req, res, next) => {
  const { email, password } = req.body;
});
