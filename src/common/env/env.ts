import * as dotenv from 'dotenv';
import { join } from 'path';

// 환경 변수 파일 경로 설정
const envPath = join(process.cwd(), process.env.NODE_ENV === 'production' ? '.env.production' : '.env');

// 환경 변수 로드
dotenv.config({ path: envPath });

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
};
