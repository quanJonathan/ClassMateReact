/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import VerificationTokenPayload from './verificationTokenPayload.interface';
import EmailService from '../email/email.service';
import { UserService } from '../user/user.service';
import { userStateEnum } from 'src/enum/userState.enum';
import { User } from 'src/user/model/user.schema';
import { ClassService } from 'src/services/class.service';
import { ObjectId } from 'mongoose';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UserService,
    private readonly classService: ClassService
  ) {}

  public async resendConfirmationLink(email: string) {
    //console.log(email);
    if (!email) return;
    const user = await this.usersService.findByEmail(email);
    //console.log(user);
    if (user[0].state === userStateEnum.activated) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user[0]);
  }

  public async confirmEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    // if (user.isEmailConfirmed)
    if (user[0].state === userStateEnum.activated) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  public async sendVerificationLink(user: User) {
    const email = user.email;
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    //console.log(token);

    //const u = await this.usersService.findByEmail(email);
    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}/receive/${token}/`;

    const text = `Welcome to ClassMate website.\n To confirm the email address, click here: \n${url}`;
    const emailTemplate = {
      to: email,
      subject: 'Email confirmation',
      text,
    };
    //console.log(emailTemplate);
    return this.emailService.sendMail(emailTemplate);
  }

  public async sendResetPasswordLink(user: Partial<User>) {
    const email = user.email;
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME_RESET',
      )}s`,
    });
    //console.log(token);

    //const u = await this.usersService.findByEmail(email);
    const url = `${this.configService.get('RESET_PASSWORD_URL')}/${token}/`;

    const text = `Welcome to ClassMate website.\n To reset password, click here: \n${url}`;
    const emailTemplate = {
      to: email,
      subject: 'Reset Password',
      text,
    };
    //console.log(emailTemplate);
    return this.emailService.sendMail(emailTemplate);
  }

  public async sendReturnHomeworkLink(user: Partial<User>, homework: Homework) {
    const email = user.email;

    const emailTemplate = {
      to: email,
      subject: `Graded: "${homework.name}"
      `,
      text: 'random things'
    };
    //console.log(emailTemplate);
    return this.emailService.sendMail(emailTemplate);
  }
  
  public async sendJoinClassLink(user: Partial<User>, url: string, classId: ObjectId) {
    try {
     
      const course = await this.classService.getByRealId(classId);
      console.log(course);
    
      if (!course) {
        throw new BadRequestException('Course not found');
      }

      const text = `Welcome to ClassMate website.\n To join ${course.className}, click here: \n${url}`;
      const emailTemplate = {
        to: user.email,
        subject: 'Join Classroom',
        text,
      };

      await this.emailService.sendMail(emailTemplate);
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to send join class email');
    }
  
   
  }
}

