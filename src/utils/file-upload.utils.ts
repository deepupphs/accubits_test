import { extname } from 'path';
import path = require('path');
import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';


export const image = {

  limits: {
    fileSize: 1024 * 1024 * 5,
  },

  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(csv)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },

  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {

      const filename1: string = path.parse(file.originalname).name.replace(/-/g,
        '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename1}${extension}`)
    }
  })
};

// export const editFileName = (req, file, callback) => {
//   const name = file.originalname.split('.')[0];
//   const fileExtName = extname(file.originalname);
//   const randomName = Array(4)
//     .fill(null)
//     .map(() => Math.round(Math.random() * 10).toString(10))
//     .join('');
//   callback(null, `${name}${randomName}${fileExtName}`);
//};