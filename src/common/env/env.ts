import dotenv from 'dotenv';

dotenv.config();

// 개발 환경이면 .env.local 파일을 사용
// 프로덕션 환경이면 .env.production 파일을 사용
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';

dotenv.config({ path: envFile });

export const env = {
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
};
