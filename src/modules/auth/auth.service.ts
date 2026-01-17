import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./jwt";
import { prisma } from "../../config/prisma";

type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const AuthService = {
  async register(
    userName: string,
    email: string,
    password: string
  ): Promise<ServiceResult<any>> {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name: userName, email, passwordHash },
    });

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id });

    return {
      success: true,
      data: { accessToken, refreshToken, user },
    };
  },

  async login(
    email: string,
    password: string
  ): Promise<ServiceResult<any>> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      return { success: false, error: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return { success: false, error: "Invalid credentials" };
    }

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = signRefreshToken({ userId: user.id });

    return {
      success: true,
      data: { accessToken, refreshToken, user },
    };
  },

  async refresh(token: string): Promise<ServiceResult<any>> {
    const decoded = verifyRefreshToken(token) as { userId?: string };

    if (!decoded?.userId) {
      return { success: false, error: "Invalid refresh token" };
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const accessToken = signAccessToken({ userId: user.id, email: user.email });

    return {
      success: true,
      data: { accessToken, user },
    };
  },
};
