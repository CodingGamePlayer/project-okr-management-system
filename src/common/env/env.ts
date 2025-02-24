import * as dotenv from 'dotenv';
import { join } from 'path';

// 환경 변수 파일 경로 설정
const envPath = join(process.cwd(), process.env.NODE_ENV === 'production' ? '.env.production' : '.env');

// 환경 변수 로드
dotenv.config({ path: envPath });

export const env = {
  // Database
  database: {
    type: 'postgres' as const,
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'admin1234',
    database: process.env.POSTGRES_DB || 'okr_db',
    synchronize: process.env.NODE_ENV !== 'production', // 개발 환경에서만 true
    logging: process.env.NODE_ENV !== 'production', // 개발 환경에서만 true
  },

  // Node
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
};
