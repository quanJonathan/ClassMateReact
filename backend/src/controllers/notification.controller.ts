/* eslint-disable prettier/prettier */
import { Controller, Get, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { NotificationService } from 'src/services/notification.service';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}


  @Post('/add/:userId')

  async addNewNotification(@Res() res: any, @Req() req: any, @Param() params: any ){
    const userId = params.userId;
    const notification = req.body.notification;
   
    const result = await this.notificationService.addNewNotification(userId,notification);

    if (result) {
      return res.status(HttpStatus.OK).json(result);
    } else {
      return res.status(HttpStatus.BAD_REQUEST).json('Create failed');
    }

  }

  @Get('/all')
  async getAll() {
    return this.notificationService.getAllNotification();
  }

  @Get('/u/:userId')
  @UseGuards(RefreshTokenGuard)
  async getByUserId(@Param() params: any){
    return this.notificationService.getAllUserNotification(params.userId);
  }


  @Get(':id')
  async getByRealId(@Param() params: any) {
    return this.notificationService.getByRealId(params.id);
  }



  
  @Get('/getOne/:id')
  async getClassId(@Param() params: any) {
    //console.log("get class")
    //console.log(params)
    return await this.notificationService.getOneByRealId(params.id);
  }

  
}
