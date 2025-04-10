export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  port_socket: parseInt(process.env.PORT_SOCKET, 10) || 3000,
  node_env: process.env.NODE_ENV || 'development',
  mongoDb: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '',
});
export const PORT = 'port';
export const NODE_ENV = 'node_env';
export const MONGODB_URI = 'mongoDb';
export const PORT_SOCKET = 'port_socket';
export const JWT_SECRET = 'JWT_SECRET';
export const JWT_EXPIRES_IN = 'JWT_EXPIRES_IN';

