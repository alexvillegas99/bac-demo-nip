export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  port_socket: parseInt(process.env.PORT_SOCKET, 10) || 3000,
  node_env: process.env.NODE_ENV || 'development',
  mongoDb: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '',
  amazon3s: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    bucketName: process.env.AWS_S3_BUCKET_NAME || '',
    bucketRegion: process.env.AWS_S3_BUCKET_REGION || '',
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10) || 587,
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
});
export const PORT = 'port';
export const NODE_ENV = 'node_env';
export const MONGODB_URI = 'mongoDb';
export const PORT_SOCKET = 'port_socket';
export const JWT_SECRET = 'JWT_SECRET';
export const JWT_EXPIRES_IN = 'JWT_EXPIRES_IN';


export const AMAZON_S3_ACCESS_KEY_ID = 'amazon3s.accessKeyId';
export const AWS_SECRET_ACCESS_KEY = 'amazon3s.secretAccessKey';
export const AWS_S3_BUCKET_NAME = 'amazon3s.bucketName';
export const AWS_S3_BUCKET_REGION = 'amazon3s.bucketRegion';


export const MAIL_HOST = 'mail.host';
export const MAIL_PORT = 'mail.port';
export const MAIL_SECURE = 'mail.secure';
export const MAIL_USER = 'mail.auth.user';
export const MAIL_PASS = 'mail.auth.pass';