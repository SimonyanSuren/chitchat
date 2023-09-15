import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repositories } from '../database/repositories';
import { User } from '../user/entities/user.entity';
import { SignUpDto } from './dto/auth.dto';
import { JwtPayload } from './interfaces/jwtPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly repositories: Repositories,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async signUp(userData: SignUpDto): Promise<User> {
    const salt = await bcrypt.genSalt(
      this.configService.get<number>('jwtConfig.BCRYPT_SALT_ROUNDS')
    );

    const user = new User();
    user.email = userData.email;
    user.password = await bcrypt.hash(userData.password, salt);
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    //@TODO: Implement email verification
    user.emailConfirmed = true;

    const createdUser = await this.repositories.USER.create(user);
    return createdUser;
  }

  public async findUserById(userId: ObjectId | string): Promise<User | null> {
    return this.repositories.USER.findById(userId);
  }

  public async validateUser(
    email: string,
    suppliedPassword: string
  ): Promise<User | null> {
    const user = await this.repositories.USER.findUserByEmailWithPass(email);
    if (!user) {
      throw new NotFoundException('User does not exist.');
    }
    const equals = await bcrypt.compare(
      suppliedPassword,
      user?.password ? user.password : ''
    );

    if (user && equals) {
      return user;
    }

    return null;
  }

  public async getCookieWithAccessToken(
    userId: ObjectId,
    remoteAddress?: string,
    userAgent?: string
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: userId.toString(),
      remoteAddress,
      userAgent,
    };

    const token = await this.jwtService.signAsync(payload);

    const cookie = `Access=${token}; HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=${this.configService.get(
      'jwtConfig.JWT_ACCESS_TOKEN_EXPIRATION_TIME'
    )}`;

    return cookie;
  }

  public async getCookieWithRefreshToken(
    userId: ObjectId,
    remoteAddress?: string,
    userAgent?: string
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: userId.toString(),
      remoteAddress,
      userAgent,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwtConfig.JWT_REFRESH_TOKEN_SECRET'),
      jwtid: this.configService.get<string>('jwtConfig.JWT_REFRESH_TOKEN_ID'),
      expiresIn: this.configService.get('jwtConfig.JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=${this.configService.get(
      'jwtConfig.JWT_REFRESH_TOKEN_EXPIRATION_TIME'
    )}`;

    await this.saveRefreshToken(userId, token);

    return cookie;
  }

  public getCookieForLogOut(): string[] {
    return [
      'Access=; HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; SameSite=Lax; Secure; Max-Age=0',
    ];
  }

  public async saveRefreshToken(userId: ObjectId, refreshToken: string): Promise<void> {
    const salt = await bcrypt.genSalt(
      this.configService.get<number>('jwtConfig.BCRYPT_SALT_ROUNDS', 10)
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await this.repositories.USER.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  public async validateRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<User | null> {
    const user = await this.repositories.USER.findById(userId).select('+refreshToken');

    if (!user?.refreshToken) {
      throw new UnauthorizedException();
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (isRefreshTokenValid) {
      return user;
    }

    return null;
  }

  public async removeRefreshToken(userId: ObjectId): Promise<void> {
    await this.repositories.USER.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }
}
