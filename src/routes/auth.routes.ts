import { createRouter } from "@/helpers";
import {
  permissionRequirement,
  validateDTO,
  validateToken,
} from "@/middlewares";
import {
  CheckUserDto,
  CreateAccountDto,
  CreateAuthDto,
  ForgotPasswordDto,
  GoogleLoginDto,
  LoginDto,
  ResetPasswordDto,
  SavePushTokenDto,
  VerifyEmailDto,
  NotificationDto,
  ChangePasswordDto,
} from "@/decorators";
import { AuthController } from "@/controllers";
import { UserTypes } from "@/enums";

export const authRouter = createRouter();
const authController = AuthController.getInstance();

authRouter.post(
  "/admin/login",
  validateDTO(LoginDto),
  authController.adminLogin
);

authRouter.get("/session", validateToken, authController.session);

authRouter.patch(
  "/change-password",
  validateToken,
  validateDTO(ChangePasswordDto),
  authController.changePassword
);

authRouter.get("/admin/seed", authController.seedAdmin);

authRouter.post("/logout", validateToken, authController.logout);

authRouter.route("/profile").get(validateToken, authController.getProfile);

authRouter.get(
  "/admin/get-admins",
  validateToken,
  permissionRequirement([UserTypes.ADMIN]),
  authController.getAdmins
);

authRouter.post(
  "/admin/create-admin",
  validateToken,
  permissionRequirement([UserTypes.ADMIN]),
  validateDTO(CreateAuthDto),
  authController.createAdmin
);
