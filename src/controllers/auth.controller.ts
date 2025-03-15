import {
  ChangePasswordDto,
  CheckUserDto,
  CreateAccountDto,
  CreateAuthDto,
  GoogleLoginDto,
  LoginDto,
  NotificationDto,
  ResetPasswordDto,
  SavePushTokenDto,
  VerifyEmailDto,
} from "@/decorators";
import { UserTypes } from "@/enums";
import { sendSuccessResponse, throwForbiddenError } from "@/helpers";
import { AuthService } from "@/services";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface GenericReq<T> extends Request<any, any, T> {}

export class AuthController {
  private readonly authService: AuthService;
  private static instance: AuthController;

  constructor() {
    this.authService = AuthService.getInstance();
  }

  static getInstance(): AuthController {
    if (!this.instance) {
      this.instance = new AuthController();
    }
    return this.instance;
  }

  adminLogin = async (req: GenericReq<LoginDto>, res: Response) => {
    const data = await this.authService.loginAdmin(req.body);
    return sendSuccessResponse(res, data);
  };

  session = async (req: Request, res: Response) => {
    const data = await this.authService.session(req.authData!);
    return sendSuccessResponse(res, data);
  };

  changePassword = async (
    req: GenericReq<ChangePasswordDto>,
    res: Response
  ) => {
    const data = await this.authService.changePassword(req.authData!, req.body);
    return sendSuccessResponse(res, data);
  };

  seedAdmin = async (req: Request, res: Response) => {
    const data = await this.authService.seedAdmin();
    return sendSuccessResponse(res, data);
  };

  logout = async (req: Request, res: Response) => {
    await this.authService.expireSession(req.authData?.userId!);
    return sendSuccessResponse(res, {}, StatusCodes.NO_CONTENT);
  };

  getProfile = async (req: Request, res: Response) => {
    const data = await this.authService.session(req.authData!);
    return sendSuccessResponse(res, data);
  };

  getAdmins = async (req: Request, res: Response) => {
    if (!req.authData?.isSuperAdmin) {
      throwForbiddenError("You are not allowed to perform this action");
    }
    const data = await this.authService.getAdmins(req.query);
    return sendSuccessResponse(res, data);
  };

  createAdmin = async (req: GenericReq<CreateAuthDto>, res: Response) => {
    const data = await this.authService.createAdmin(req.body, req.authData!);
    return sendSuccessResponse(res, data, StatusCodes.CREATED);
  };
}
