import {
  dummyPaymentHandler,
  DefaultSearchPlugin,
  VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { BullMQJobQueuePlugin } from '@vendure/job-queue-plugin/package/bullmq';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';

const IS_DEV = process.env.NODE_ENV !== 'production';

// Configure S3-compatible storage (Minio)
const s3Client = new S3Client({
  endpoint: `http://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true,
});

export const config: VendureConfig = {
  apiOptions: {
    port: 3001,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    adminApiPlayground: IS_DEV,
    adminApiDebug: IS_DEV,
    shopApiPlayground: IS_DEV,
    shopApiDebug: IS_DEV,
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME || 'superadmin',
      password: process.env.SUPERADMIN_PASSWORD || 'superadmin',
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET || 'cookie-secret-change-me',
    },
    sessionCacheStrategy: {
      type: 'redis',
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    },
  },
  dbConnectionOptions: {
    type: 'postgres',
    synchronize: IS_DEV,
    logging: false,
    database: process.env.DB_NAME || 'vendure',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  customFields: {},
  plugins: [
    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
      storageStrategyFactory: () => ({
        async writeFileFromBuffer(fileName: string, data: Buffer) {
          // Upload to Minio
          const { PutObjectCommand } = await import('@aws-sdk/client-s3');
          await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.MINIO_BUCKET || 'vendure-assets',
              Key: fileName,
              Body: data,
            })
          );
          return fileName;
        },
        async writeFileFromStream(fileName: string, data: any) {
          const chunks: Buffer[] = [];
          for await (const chunk of data) {
            chunks.push(chunk);
          }
          return this.writeFileFromBuffer(fileName, Buffer.concat(chunks));
        },
        async readFileToBuffer(identifier: string) {
          const { GetObjectCommand } = await import('@aws-sdk/client-s3');
          const response = await s3Client.send(
            new GetObjectCommand({
              Bucket: process.env.MINIO_BUCKET || 'vendure-assets',
              Key: identifier,
            })
          );
          return Buffer.from(await response.Body!.transformToByteArray());
        },
        async readFileToStream(identifier: string) {
          const buffer = await this.readFileToBuffer(identifier);
          const { Readable } = await import('stream');
          return Readable.from(buffer);
        },
        async deleteFile(identifier: string) {
          const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.MINIO_BUCKET || 'vendure-assets',
              Key: identifier,
            })
          );
        },
        async fileExists(fileName: string) {
          try {
            const { HeadObjectCommand } = await import('@aws-sdk/client-s3');
            await s3Client.send(
              new HeadObjectCommand({
                Bucket: process.env.MINIO_BUCKET || 'vendure-assets',
                Key: fileName,
              })
            );
            return true;
          } catch {
            return false;
          }
        },
        toAbsoluteUrl(request: any, identifier: string) {
          const host = request.headers.get('host') || 'localhost:3001';
          return `http://${host}/assets/${identifier}`;
        },
      }),
    }),
    BullMQJobQueuePlugin.init({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, '../static/email/test-emails'),
      route: 'mailbox',
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, '../static/email/templates'),
      globalTemplateVars: {
        fromAddress: '"Vendure Store" <noreply@vendure-store.com>',
        verifyEmailAddressUrl: process.env.SHOP_URL || 'http://localhost:3000/verify',
        passwordResetUrl: process.env.SHOP_URL || 'http://localhost:3000/reset-password',
        changeEmailAddressUrl: process.env.SHOP_URL || 'http://localhost:3000/change-email',
      },
    }),
  ],
};
