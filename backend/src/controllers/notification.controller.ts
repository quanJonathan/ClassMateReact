/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { NotificationService } from 'src/services/notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}
}
