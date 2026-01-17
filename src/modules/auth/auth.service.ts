import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./jwt";
import { prisma } from "../../config/prisma";

export const AuthService = {
  async register(userName: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name:userName, email, passwordHash },
    });

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id });

    return { accessToken, refreshToken, user };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error("Invalid credentials");

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id });

    return { accessToken, refreshToken, user };
  },

  async refresh(token: string) {
    // 1. Verify the token
    const decoded = verifyRefreshToken(token) as { userId: string };
    if (!decoded || !decoded.userId) throw new Error("Invalid refresh token");

    // 2. Find the user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) throw new Error("User not found");

    // 3. Generate a new Access Token
    const accessToken = signAccessToken({ userId: user.id, email: user.email });

    return { accessToken, user };
  }
  
};
