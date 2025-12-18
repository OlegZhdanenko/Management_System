import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendWelcomeEmail(to: string, name: string, verifyToken: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Welcome to Management System',
      html: `
        <h2>Hello, ${name} 👋</h2>
        <p>Your account has been successfully created.</p>
        <p>You can now log in to the system.</p>
        <p>Please enter your verify key ${verifyToken}</p>
        <hr />
        <small>Management System</small>
      `,
    });
  }
}
