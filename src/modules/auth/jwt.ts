import jwt from "jsonwebtoken";
import { env } from "../../env";

const ACCESS_SECRET = env.JWT_ACCESS_SECRET! ;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET! ;

export function signAccessToken(payload: object) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1hr" });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    // This checks if the token is valid and not expired
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    // If the token is tampered with or expired, it returns null
    return null;
  }
}
