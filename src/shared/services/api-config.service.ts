import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { ServiceAccount } from 'firebase-admin';
import { isNil } from 'lodash';

import { UserSubscriber } from '../../entity-subscribers/user-subscriber';
import { SnakeNamingStrategy } from '../../snake-naming.strategy';

@Injectable()
export class ApiConfigService {
  constructor(private nestConfigService: NestConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get defoultMailFrom() {
    return this.getString('MAIL_FROM');
  }

  get verificationUrl() {
    return this.getString('VERIFICATION_URL');
  }

  get forgotPasswordUrl() {
    return this.getString('FORGOT_PASSWORD_URL');
  }

  get changeEmailUrl() {
    return this.getString('CHANGE_EMAIL_URL');
  }

  get partUrl() {
    return this.getString('PATH_URL');
  }

  get mailConfig() {
    return {
      transport: {
        service: this.getString('MAIL_SERVICE'),
        auth: {
          user: this.getString('MAIL_USER'),
          pass: this.getString('MAIL_PASSWORD'),
        },
      },
    };
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE').toLowerCase();
  }

  get postgresConfig(): TypeOrmModuleOptions {
    let entities = [
      __dirname + '/../../modules/**/*.entity{.ts,.js}',
      __dirname + '/../../modules/**/*.view-entity{.ts,.js}',
    ];
    let migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];

    // if (module.hot) {
    //   const entityContext = require.context(
    //     './../../modules',
    //     true,
    //     /\.entity\.ts$/,
    //   );
    //   entities = entityContext.keys().map((id) => {
    //     const entityModule = entityContext(id) as Record<string, unknown>;
    //     const [entity] = Object.values(entityModule);

    //     return entity as string;
    //   });
    //   const migrationContext = require.context(
    //     './../../database/migrations',
    //     false,
    //     /\.ts$/,
    //   );

    //   migrations = migrationContext.keys().map((id) => {
    //     const migrationModule = migrationContext(id) as Record<string, unknown>;
    //     const [migration] = Object.values(migrationModule);

    //     return migration as string;
    //   });
    // }

    return {
      entities,
      migrations,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'postgres',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      subscribers: [UserSubscriber],
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  get natsConfig() {
    return {
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      expirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  get firebaseConfig(): { credential: ServiceAccount } {
    return {
      credential: {
        privateKey: this.getString('FIREBASE_PRIVATE_KEY'),
        projectId: this.getString('FIREBASE_PROJECT_ID'),
        clientEmail: this.getString('FIREBASE_CLIENT_EMAIL'),
      },
    };
  }

  private get(key: string): string {
    const value = this.nestConfigService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }
}
