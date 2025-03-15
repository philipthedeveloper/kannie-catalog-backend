import { config } from "@/config";
import { TTL, UserTypes } from "@/enums";
import { AuthData } from "@/interfaces";
import { Admin, IAdmin, IUser, User } from "@/models";
import { CacheService, PaginationService, SmtpEmailService } from "@/utils";
import { Model, Types } from "mongoose";
import { v4 } from "uuid";
import { JwtService } from "./jwt.service";
import {
  ChangePasswordDto,
  CreateAuthDto,
  GetUserAltDto,
  GetUserPasswordDto,
  LoginDto,
} from "@/decorators";
import {
  throwConflictError,
  throwForbiddenError,
  throwUnauthorizedError,
  throwUnprocessableEntityError,
} from "@/helpers";
import { webcrypto } from "crypto";

export class AuthService {
  private static instance: AuthService;

  // Model
  private readonly userModel: Model<IUser> = User;
  private readonly adminModel: Model<IAdmin> = Admin;

  // Services
  private readonly cacheService: CacheService;
  private readonly jwtService: JwtService;
  private readonly emailService: SmtpEmailService;

  // Pagination
  private readonly userPagination: PaginationService<IUser>;
  private readonly adminPagination: PaginationService<IAdmin>;

  constructor() {
    this.cacheService = CacheService.getInstance();
    this.jwtService = JwtService.getInstance();
    this.emailService = SmtpEmailService.getInstance();
    this.userPagination = new PaginationService(this.userModel);
    this.adminPagination = new PaginationService(this.adminModel);
  }

  /**
   * Gets an instance of the AuthService
   * @returns {AuthService}
   */
  static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }
    return this.instance;
  }

  /**
   * A key used to map auth session id to the user id
   * @param {string} userId
   * @returns {string}
   */
  sessionKeyMap(userId: string): string {
    return `auth-session-map-${userId}`;
  }

  /**
   * Expires existing session
   * @param {string} userId
   * @returns {void}
   */
  async expireSession(userId: string): Promise<void> {
    // fetch any existing session for user
    const existingAuthKey = await this.cacheService.get<string>(
      this.sessionKeyMap(userId)
    );
    // delete any exist session
    if (existingAuthKey) {
      await this.cacheService.delete(existingAuthKey);
    }
  }

  /**
   * Refresh a user's session when there is change in the user's data
   * @param user {IUser}
   * @param userType {UserTypes}
   * @param authId {string}
   */
  async refreshSession(user: IUser, userType: UserTypes, authId: string) {
    const authData = await this.cacheService.get<AuthData>(authId);
    // set new session details on cache
    const { _id: userId, email, firstName, lastName, isSuperAdmin } = user;
    await this.cacheService.set(
      authId,
      {
        userId,
        email,
        firstName,
        lastName,
        userType,
        isSuperAdmin,
        exp: authData?.exp,
        access: [],
        authId,
      },
      config.jwt.ttl
    );

    await this.cacheService.set<string>(this.sessionKeyMap(user.id), authId);
  }

  /**
   * Sets a new session and expires existing one
   * @param user {IUser}
   * @param userType {UserType}
   * @param expire {number | null}
   * @returns {Promise<object>}
   */
  async setSession(
    user: IUser,
    userType: UserTypes,
    expire: number | null
  ): Promise<object> {
    const authId = `auth-id-${v4()}`;
    await this.expireSession(user.id);
    const ex = expire || config.jwt.ttl;
    const { _id: userId, email, firstName, lastName, isSuperAdmin } = user;
    await this.cacheService.set(
      authId,
      {
        userId,
        email,
        firstName,
        lastName,
        userType,
        isSuperAdmin,
        exp: Date.now() / 1000 + ex,
        access: [],
        authId,
      },
      ex
    );

    await this.cacheService.set<string>(this.sessionKeyMap(user.id), authId);

    const u = user.toObject();
    const { hash, salt, deviceId, pushToken, ...rest } = u;

    return {
      user: rest,
      token: this.jwtService.generateToken(authId, ex),
    };
  }

  /**
   *
   * @param loginDto
   * @returns {Promise<object>}
   */
  async loginAdmin(loginDto: LoginDto): Promise<object> {
    const user = await this.adminModel.findOne({
      email: loginDto.email.toLowerCase(),
    });

    // If user could not be found in email
    if (!user) return throwUnauthorizedError("Invalid email or password");

    // If the input password is invalid
    const validPassword = await user.validatePassword(loginDto.password);

    if (!validPassword)
      return throwUnauthorizedError("Invalid email or password");

    // If the account is inactive
    if (!user.isActive)
      return throwUnprocessableEntityError("Your account is inactive");

    user.lastLogin = new Date();
    await user.save();
    return await this.setSession(user, UserTypes.ADMIN, null);
  }

  /**
   * Returns a string f length 6
   * @returns {string}
   */
  generateOTP(): string {
    return webcrypto.getRandomValues(new Uint32Array(1)).toString().slice(0, 6);
  }

  async changePassword(auth: AuthData, body: ChangePasswordDto) {
    let user;

    switch (auth.userType) {
      case UserTypes.ADMIN:
        user = await this.adminModel
          .findById(auth.userId)
          .select(GetUserPasswordDto)
          .exec();
        break;
      default:
        user = await this.userModel
          .findById(auth.userId)
          .select(GetUserPasswordDto)
          .exec();
    }

    if (!user)
      return throwUnprocessableEntityError(`Invalid account, please try again`);

    const isValidPassword = await user.validatePassword(body.oldPassword);

    if (!isValidPassword) {
      throwUnprocessableEntityError("Invalid password provided");
    }

    await user.setPassword(body.password);
    await user.save();

    return { message: "Password changed successfully" };
  }

  async seedAdmin() {
    let exists = await this.adminModel.exists({}).exec();

    if (!exists) {
      const user = await this.adminModel.create({
        email: "philipowolabi79@gmail.com",
        firstName: "Philip",
        lastName: "Owolabi",
        isSuperAdmin: true,
      });

      await user.setPassword("Pass1234.");
      await user.save();
    }

    return { message: "Admin seeded successfully" };
  }

  async session(usr: AuthData): Promise<any> {
    let user;

    switch (usr.userType) {
      case UserTypes.ADMIN:
        user = await this.adminModel
          .findById(usr.userId)
          .select(GetUserAltDto)
          .exec();
        break;
      default:
        user = await this.userModel
          .findById(usr.userId)
          .select(GetUserAltDto)
          .exec();
    }

    if (!user) {
      throwUnauthorizedError("Invalid account, Please try again");
    }

    return { user };
  }

  getAdmins(query: any) {
    if (query.id) {
      query.id = new Types.ObjectId(query.id);
    }
    return this.adminPagination.paginate(
      {
        ...query,
        deletedAt: { $exists: false },
        projections: [
          "id",
          "firstName",
          "lastName",
          "email",
          "createdAt",
          "updatedAt",
        ],
      },
      ["id", "firstName", "lastName", "email"]
    );
  }

  async createAdmin(body: CreateAuthDto, auth: AuthData) {
    if (!auth.isSuperAdmin) {
      throwForbiddenError("You are not allowed to perform this action");
    }

    if (await this.adminModel.exists({ email: body.email })) {
      throwConflictError("Admin with email already exists");
    }

    let user = await this.adminModel.create(body);

    await user.setPassword(body.password);
    await user.save();

    return { user, message: "Admin created" };
  }
}
