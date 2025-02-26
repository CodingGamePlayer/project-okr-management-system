import { DataSourceOptions } from 'typeorm';
import { join } from 'path';
import * as dotenv from 'dotenv';

const envPath = join(
  process.cwd(),
  process.env.NODE_ENV === 'test' ? '.env.test' : process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
);

dotenv.config({ path: envPath });

const getTypeOrmConfig = (): DataSourceOptions => {
  const baseConfig = {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'okr_management',
  };

  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        ...baseConfig,
        synchronize: false,
        logging: false,
      };
    case 'test':
      return {
        ...baseConfig,
        synchronize: true,
        // logging: true,
        dropSchema: true,
      };
    default: // development
      return {
        ...baseConfig,
        synchronize: true,
        // logging: true,
      };
  }
};

export const typeOrmConfig = getTypeOrmConfig();
