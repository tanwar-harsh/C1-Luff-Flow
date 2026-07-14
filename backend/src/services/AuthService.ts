import { UserSummary } from '../types/domain';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { IRefreshTokenRepository } from '../repositories/interfaces/IRefreshTokenRepository';
import { UnauthorizedError, ValidationError } from '../utils/AppError';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateRefreshToken, hashToken } from '../utils/tokenHash';
import { getRefreshTokenExpiresAt, signAccessToken } from '../utils/jwt';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async register(input: RegisterInput): Promise<{ user: UserSummary; tokens: AuthTokens }> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new ValidationError('Validation failed', [
        { field: 'email', message: 'Email is already registered' },
      ]);
    }

    const passwordHash = await hashPassword(input.password);
    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: 'USER',
    });

    const tokens = await this.issueTokens(user);
    return { user, tokens };
  }

  async login(input: LoginInput): Promise<{ user: UserSummary; tokens: AuthTokens }> {
    const user = await this.userRepository.findByEmailWithPassword(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const { passwordHash: _passwordHash, ...publicUser } = user;
    const tokens = await this.issueTokens(publicUser);
    return { user: publicUser, tokens };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const tokenHash = hashToken(refreshToken);
    const stored = await this.refreshTokenRepository.findValidByTokenHash(tokenHash);
    if (!stored) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findById(stored.userId);
    if (!user) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    await this.refreshTokenRepository.revoke(stored.id);
    return this.issueTokens(user);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }

    const tokenHash = hashToken(refreshToken);
    const stored = await this.refreshTokenRepository.findValidByTokenHash(tokenHash);
    if (stored) {
      await this.refreshTokenRepository.revoke(stored.id);
    }
  }

  private async issueTokens(user: UserSummary): Promise<AuthTokens> {
    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken();
    await this.refreshTokenRepository.create({
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: getRefreshTokenExpiresAt(),
    });

    return { accessToken, refreshToken };
  }
}
