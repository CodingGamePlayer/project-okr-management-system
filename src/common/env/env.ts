import * as dotenv from 'dotenv';
import { join } from 'path';
import { Entities } from '../entities';

// 환경 변수 파일 경로 설정
const envPath = join(process.cwd(), process.env.NODE_ENV === 'production' ? '.env.production' : '.env');

// 환경 변수 로드
dotenv.config({ path: envPath });

export const env = {
  database: {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'okr_management',
    entities: Entities,
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
};
