export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  node_env: process.env.NODE_ENV || 'development',
  mongoDb: process.env.MONGO_URI || '',
 
});
export const PORT = 'port';
export const NODE_ENV = 'node_env';
export const MONGODB_URI = 'mongoDb';

