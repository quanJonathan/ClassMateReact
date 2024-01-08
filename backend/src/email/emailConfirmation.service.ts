/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import VerificationTokenPayload from './verificationTokenPayload.interface';
import EmailService from '../email/email.service';
import { UserService } from '../user/user.service';
import { userStateEnum } from 'src/enum/userState.enum';
import { User } from 'src/user/model/user.schema';
import { ClassService } from 'src/services/class.service';
import { ObjectId } from 'mongoose';
import { Homework } from 'src/model/homework.schema';
import { GradeReview } from 'src/model/grade-review.schema';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UserService,
    private readonly classService: ClassService,
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

  async sendNotificationForGradeReview(
    homeworkId: ObjectId,
    gradeReview: GradeReview,
  ) {
    const foundClass = await this.classService.getClassByHomework(homeworkId);
    const foundHomework = await this.classService.getHomeworkById(homeworkId);
    if (!foundClass || foundClass.state == 'inactive') {
      throw new NotFoundException('This class is either inactive or deleted');
    }

    const teachersEmails = foundClass.members
      .filter((m) => {
        const classObject = m.classes.find((c) => c.classId == foundClass._id);
        return classObject.role === '3000';
      })
      .map((teacher) => teacher.email);

    if (!teachersEmails) return;
    else {
      const student = gradeReview.user[0];
      const currentScore = foundHomework.doneMembers.find(
        (m) => (m.memberId as ObjectId).toString() == student._id.toString(),
      ).score;
      const htmlText = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            border: 1px solid #000;
            padding: 20px;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        header {
            width: 100%;
            margin-bottom: 10px; 
        }
        button {
            width: 100%;
            background: none;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            color: inherit;
            text-decoration: none;
            text-align: center;
            word-break: ellipsis;
        }
        h5 {
            color: gray;
            align-content: start;
            margin: 0; 
        }
        hr {
            color: black;
            width: 100%;
            margin: 10px 0; 
        }
        
        h3 {
          padding: 0;
          margin: 0;
        }
        p {
            margin: 0; 
        }
  
        a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #B6A5FF;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }
        
        .container{
          margin: 10px;
          width: 90%;
        }
    </style>
    <title>ClassMate</title>
</head>
<body>

    <header>
        <button type="button">${foundClass?.className}</button>
    </header>

    <hr>
    <a href="" style="background-color: #000000;">${foundHomework.name}</a>
  
    <div class="container">
      <h5>${student.firstName} ${student.lastName} request grade review</h5>
      <h3><string>Current score: ${currentScore}
      <h3><strong>Expected score: ${gradeReview.expectedGrade}/${foundHomework.maxScore}</strong></h3>
      <p>Your assignment has been graded</p>
    </div>

    <a href="https://www.example.com">View grade</a>

</body>
</html>
      `;

      const emailTemplate = {
        to: teachersEmails,
        subject: `Grade Review: "${foundHomework.name}"`,
        html: htmlText,
      };
      return this.emailService.sendMail(emailTemplate);
    }
  }

  public async sendReturnHomeworkLink(
    user: MailUser,
    className: string,
    homework: MailHomework,
  ) {
    if ((user.memberId as User)?.email) {
      const htmlText = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            border: 1px solid #000;
            padding: 20px;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        header {
            width: 100%;
            margin-bottom: 10px; 
        }
        button {
            width: 100%;
            background: none;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            color: inherit;
            text-decoration: none;
            text-align: center;
            word-break: ellipsis;
        }
        h5 {
            color: gray;
            align-content: start;
            margin: 0; 
        }
        hr {
            color: black;
            width: 100%;
            margin: 10px 0; 
        }
        
        h3 {
          padding: 0;
          margin: 0;
        }
        p {
            margin: 0; 
        }
  
        a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #B6A5FF;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }
        
        .container{
          margin: 10px;
          width: 90%;
        }
    </style>
    <title>ClassMate</title>
</head>
<body>

    <header>
        <button type="button">${className}</button>
    </header>

    <hr>
    <a href="" style="background-color: #000000;">${homework.name}</a>
  
    <div class="container">
      <h5>Grade</h5>
      <h3><strong>Score: ${user.score}/${homework.maxScore}</strong></h3>
      <p>Your assignment has been graded</p>
    </div>

    <a href="https://www.example.com">View grade</a>

</body>
</html>
      `;

      const emailTemplate = {
        to: (user.memberId as User).email,
        subject: `Graded: "${homework.name}"`,
        html: htmlText,
      };
      return this.emailService.sendMail(emailTemplate);
    }

    //console.log(emailTemplate)
  }

  async sendMultipleReturnHomeworkLink(
    className: string,
    homework: MailHomework,
    users: MailUser[],
  ) {
    users.forEach((u) => {
      this.sendReturnHomeworkLink(u, className, homework);
    });
  }

  public async sendJoinClassLink(
    user: Partial<User>,
    url: string,
    classId: ObjectId,
  ) {
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
      throw new BadRequestException(
        error.message || 'Failed to send join class email',
      );
    }
  }
}
