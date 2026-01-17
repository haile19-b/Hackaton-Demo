import type { Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
import { env } from "../../env";

export const AuthController = {
    async register(req: Request, res: Response) {
        try {
            const { email, userName, password } = RegisterSchema.parse(req.body);
            const { accessToken, refreshToken, user } = await AuthService.register(userName, email, password);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(201).json({ success: true, accessToken, user: { id: user.id, email: user.email } });
        } catch (error: any) {
            return res.status(400).json({ success: false, error: error.message });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const { email, password } = LoginSchema.parse(req.body);
            const { accessToken, refreshToken, user } = await AuthService.login(email, password);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.json({ success: true, accessToken, user: { id: user.id, email: user.email } });
        } catch (error: any) {
            return res.status(401).json({ success: false, error: error.message });
        }
    },

    async refresh(req: Request, res: Response) {
        try {
            // Get the cookie from the request
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ success: false, error: "No refresh token provided" });
            }

            const { accessToken, user } = await AuthService.refresh(refreshToken);

            return res.json({
                success: true,
                accessToken,
                user: { id: user.id, email: user.email }
            });
        } catch (error: any) {
            return res.status(401).json({ success: false, error: error.message });
        }
    },

    async logout(req: Request, res: Response) {
        try {
            res.clearCookie("refreshToken");
            return res.json({ success: true });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};
