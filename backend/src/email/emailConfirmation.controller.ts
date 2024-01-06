/* eslint-disable prettier/prettier */
import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import ConfirmEmailDto from './confirmEmail.dto';
import { Request, Response } from 'express';
import { EmailConfirmationService } from './emailConfirmation.service';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('resend-confirmation-link')
  async resendConfirmationLink(@Req() request) {
    //console.log(request);
    await this.emailConfirmationService.resendConfirmationLink(
      request.body.email,
    );
  }

  @Post('verify')
  async confirm(@Body() confirmationData: ConfirmEmailDto) {
    //console.log(confirmationData.token);
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmationData.token,
    );
    //console.log(email);
    await this.emailConfirmationService.confirmEmail(email);
  }
}
