import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { extname } from 'path';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export const fileFilter = (
  req: Request,
  file: { mimetype: string },
  callback: (error: Error | null, acceptFile: boolean) => void,
): void => {
  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'text/plain',
  ];

  if (!allowedFileTypes.includes(file.mimetype)) {
    return callback(new HttpException('지원하지 않는 파일 형식입니다.', HttpStatus.BAD_REQUEST), false);
  }
  callback(null, true);
};

export const editFileName = (
  req: Request,
  file: MulterFile,
  callback: (error: Error | null, filename: string) => void,
): void => {
  const fileExtName = extname(file.originalname);
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${randomName}${fileExtName}`);
};
