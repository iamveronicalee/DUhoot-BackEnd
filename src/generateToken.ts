import { sign } from "jsonwebtoken";

export function generateAccessToken(user) {
  return sign({user}, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "60m" });
}

export function generateRefreshAccessToken(user) {
  return sign({user}, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
}
