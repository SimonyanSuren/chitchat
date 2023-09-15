import { Expose, plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  // use @Expose decorator to keep only defined properties
  @Expose()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @Expose()
  @IsString()
  @IsNotEmpty()
  LISTEN_INTERFACE: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  HTTP_PORT: number;
}

export class DatabaseConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  MONGODB_URI: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  MONGODB_HOST: string;

  @Expose()
  @IsNumber()
  MONGODB_PORT: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  MONGODB_NAME: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  MONGODB_USER: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  MONGODB_PASS: string;
}

export class JwtConfig {
  // Access token
  @Expose()
  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_TOKEN_SECRET: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_TOKEN_ID: string;

  // Refresh token
  @Expose()
  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_SECRET: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_ID: string;

  @Expose()
  @IsNumber()
  BCRYPT_SALT_ROUNDS: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ENCRYPTION_ALGORITHM: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ENCRYPTION_KEY: string;
}

export function validate(
  envConfig: Record<string, any>
): Record<string, string | number | object> {
  const environmentVariables = plainToInstance(EnvironmentVariables, envConfig, {
    // convert env properties based their type definition in classes
    enableImplicitConversion: true,
    // strip unnecessary properties from config object based "@Expose" decorator that defined in classes
    excludeExtraneousValues: true,
  });
  const databaseConfig = plainToInstance(DatabaseConfig, envConfig, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });
  const jwtConfig = plainToInstance(JwtConfig, envConfig, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  const errors = [
    ...validateSync(environmentVariables, { skipMissingProperties: false }),
    ...validateSync(databaseConfig, { skipMissingProperties: false }),
    ...validateSync(jwtConfig, { skipMissingProperties: false }),
  ];

  if (errors.length > 0) {
    throw new Error(`Environment config validation error: ${errors.join(', ')}`);
  }

  return {
    ...environmentVariables,
    databaseConfig,
    jwtConfig,
  };
}
