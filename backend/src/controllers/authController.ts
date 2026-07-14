import { Request, Response } from 'express';
import { Services } from '../services';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import {
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from '../utils/cookies';
import { LoginBody, RegisterBody } from '../validators/schemas';

export function createAuthController(services: Services) {
  const register = asyncHandler(async (req: Request, res: Response) => {
    const body = req.validated!.body as RegisterBody;
    const { user, tokens } = await services.authService.register(body);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.status(201).json(successResponse({ user }));
  });

  const login = asyncHandler(async (req: Request, res: Response) => {
    const body = req.validated!.body as LoginBody;
    const { user, tokens } = await services.authService.login(body);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.status(200).json(successResponse({ user }));
  });

  const refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
    const tokens = await services.authService.refresh(refreshToken ?? '');
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.status(200).json(successResponse({ message: 'Token refreshed' }));
  });

  const logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as string | undefined;
    await services.authService.logout(refreshToken);
    clearAuthCookies(res);
    res.status(200).json(successResponse({ message: 'Logged out' }));
  });

  const me = asyncHandler(async (req: Request, res: Response) => {
    const user = await services.userService.getUserById(req.user!.id);
    res.status(200).json(successResponse({ user }));
  });

  return { register, login, refresh, logout, me };
}
