import type { Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { env } from "../../env";

export const AuthController = {
  async register(req: Request, res: Response) {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.message,
      });
    }

    const { email, userName, password } = parsed.data;
    const result = await AuthService.register(userName, email, password);

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    const { accessToken, refreshToken, user } = result.data;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      accessToken,
      user: { id: user.id, email: user.email },
    });
  },

  async login(req: Request, res: Response) {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.message,
      });
    }

    const { email, password } = parsed.data;
    const result = await AuthService.login(email, password);

    if (!result.success) {
      return res.status(401).json({ success: false, error: result.error });
    }

    const { accessToken, refreshToken, user } = result.data;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      accessToken,
      user: { id: user.id, email: user.email },
    });
  },

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: "No refresh token provided",
      });
    }

    const result = await AuthService.refresh(refreshToken);

    if (!result.success) {
      return res.status(401).json({ success: false, error: result.error });
    }

    const { accessToken, user } = result.data;

    return res.json({
      success: true,
      accessToken,
      user: { id: user.id, email: user.email },
    });
  },

  async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");
    return res.json({ success: true });
  },
};
