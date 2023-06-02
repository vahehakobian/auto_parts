import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import type { ISendMailOptions } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';

import { ApiConfigService } from './api-config.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ApiConfigService,
  ) {}

  async send(mailData: ISendMailOptions): Promise<void> {
    mailData.from = mailData.from || this.configService.defoultMailFrom;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.mailerService.sendMail(mailData);
  }

  verificationMail(fullName: string, url: string) {
    return `
        <h1> հարգելի ${fullName} !</h1>
        <!doctype html>
        <html lang="en-US">
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email Template</title>
            <meta name="description" content="Reset Password Email Template.">
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
        </head>
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #F2F3F8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#F2F3F8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700%7COpen+Sans:300,400,600,700);
             font-family: 'Open Sans', sans-serif;">
            <tr>
            <td>
                <table style="background-color: #F2F3F8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <img 
                                width="120" 
                                src='https://veevee.am/autoimporters/logo.png' 
                                title="logo" 
                                alt="logo">
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff;
                                 border-radius:3px;
                                  text-align:center;
                                  -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);
                                  -moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);
                                  box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                        Նախքան սկսելը, խնդրում ենք ստուգել ձեր էլ․ հասցեն՝ սեղմելով ստորև նշված հղումը.
                                        </p>
                                        <a href="${url.toString()}"
                                            style="background:#20e277;
                                            text-decoration:none !important; 
                                            font-weight:500; 
                                            margin-top:35px; 
                                            color:#fff;text-transform:uppercase; 
                                            font-size:14px;
                                            padding:10px 24px;
                                            display:inline-block;border-radius:50px;">Verification</a> <br/>
                                        <p style="text-align: center">
                                            Մենք չենք կարող սպասել, որ դուք սկսեք ձեր ճանապարհորդությունը Autoimporters-ի հետ: 
                                            Եթե ունեք հարցեր կամ կարծիքներ, մի հապաղեք կապվել մեր աջակցման թիմի հետ:
                                            <br/>
                                            հարգանքներով\`<br/>
                                            <strong>Autoimporters Team<strong/>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
            </tr>
            </table>
            <!--/100% body table-->
        </body>
        </html>`;
  }

  subscribeMail(fullName: string, url: string) {
    return `
        <h1> հարգելի ${fullName} !</h1>
        <!doctype html>
        <html lang="en-US">
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email Template</title>
            <meta name="description" content="Reset Password Email Template.">
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
        </head>
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #F2F3F8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#F2F3F8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700%7COpen+Sans:300,400,600,700);
             font-family: 'Open Sans', sans-serif;">
            <tr>
            <td>
                <table style="background-color: #F2F3F8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                            <img 
                                width="120" 
                                src='https://veevee.am/autoimporters/logo.png' 
                                title="logo" 
                                alt="logo">
                        </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff;
                                 border-radius:3px;
                                  text-align:center;
                                  -webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);
                                  -moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);
                                  box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                            dzez hetaqrqrox apranqy avelacvel e autopartsum anceq hxumov\`\
                                        </p>
                                        <a href="${url.toString()}"
                                            style="background:#20e277;
                                            text-decoration:none !important; 
                                            font-weight:500; 
                                            margin-top:35px; 
                                            color:#fff;text-transform:uppercase; 
                                            font-size:14px;
                                            padding:10px 24px;
                                            display:inline-block;border-radius:50px;">Verification</a> <br/>
                                        <p style="text-align: center">
                                            <br/>
                                            հարգանքներով\`<br/>
                                            <strong>AutoParts Team<strong/>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
            </tr>
            </table>
            <!--/100% body table-->
        </body>
        </html>`;
  }
}
