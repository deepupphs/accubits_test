import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { image } from 'src/utils/file-upload.utils';
import { CreateUserInfo } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('create')
    async createUserInfo(
      @Body() createUserInfo: CreateUserInfo
    ) {
  
      const userInfo = await this.userService.create(
        createUserInfo.firstName,
        createUserInfo.lastName,
        createUserInfo.email,
        createUserInfo.age
      );
      if (userInfo) {
        return userInfo;
      }
      throw new BadRequestException();
    }


    @Post('upload')
    @UseInterceptors(FileInterceptor('file', image))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      return await this.userService.uploadfile(file);
    }
}
