import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  // Environment
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),

  // Database
  database: {
    url: process.env.MONGODB_URI,
  },

  jwt: {
    secret: process.env.JWT_SECRET
  }

}));
