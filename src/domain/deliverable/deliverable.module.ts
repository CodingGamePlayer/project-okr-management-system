import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { DeliverableController } from './deliverable.controller';
import { DeliverableService } from './deliverable.service';
import { Deliverable } from '../../common/entities/Deliverable.entity';
import { DeliverableAssignment } from '../../common/entities/DeliverableAssignment.entity';
import { OKR } from '../../common/entities/OKR.entity';
import { Project } from '../../common/entities/Project.entity';
import * as path from 'path';
import * as fs from 'fs';
import { fileFilter } from '../../common/utils/file-upload.utils';
import { diskStorage } from 'multer';

const uploadsDir = './uploads';

// uploads 디렉토리가 없으면 생성
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Deliverable, DeliverableAssignment, OKR, Project]),
    MulterModule.register({
      storage: diskStorage({
        destination: uploadsDir,
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        },
      }),
      fileFilter: fileFilter,
    }),
  ],
  controllers: [DeliverableController],
  providers: [DeliverableService],
  exports: [DeliverableService],
})
export class DeliverableModule {}
