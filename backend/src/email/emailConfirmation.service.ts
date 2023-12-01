import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import VerificationTokenPayload from './verificationTokenPayload.interface';
import EmailService from '../email/email.service';
import { UserService } from '../user/user.service';
import { userStateEnum } from 'src/enum/userState.enum';
import { User } from 'src/user/model/user.schema';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UserService,
  ) {}

  public async resendConfirmationLink(email: string) {
    console.log(email);
    const user = await this.usersService.findByEmail(email);
    console.log(user);
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
    console.log(token);

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
    console.log(emailTemplate);
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
    console.log(token);

    //const u = await this.usersService.findByEmail(email);
    const url = `${this.configService.get('RESET_PASSWORD_URL')}/${token}/`;

    const text = `Welcome to ClassMate website.\n To reset password, click here: \n${url}`;
    const emailTemplate = {
      to: email,
      subject: 'Reset Password',
      text,
    };
    console.log(emailTemplate);
    return this.emailService.sendMail(emailTemplate);
  }
}
