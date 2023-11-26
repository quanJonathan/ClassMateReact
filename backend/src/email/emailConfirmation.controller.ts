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
  @UseInterceptors(ClassSerializerInterceptor)
  export class EmailConfirmationController {
    constructor(
      private readonly emailConfirmationService: EmailConfirmationService
    ) {}

    @Post('resend-confirmation-link')
    async resendConfirmationLink(@Req() request: Request) {
      await this.emailConfirmationService.resendConfirmationLink(request.userEntity.email);
    }
   
    @Post('confirm')
    async confirm(@Body() confirmationData: ConfirmEmailDto) {
      const email = await this.emailConfirmationService.decodeConfirmationToken(confirmationData.token);
      await this.emailConfirmationService.confirmEmail(email);
    }
  }