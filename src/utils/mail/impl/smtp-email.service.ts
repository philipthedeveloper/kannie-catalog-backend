import Email from "email-templates";
import { IEmailOptions, MailResponse, MailService } from "../mail.service";
import { config } from "@/config";
import { createTransport } from "nodemailer";
import { logger } from "@/logging";
import Handlebars from "handlebars";

export class SmtpEmailService extends MailService {
  mailService: Email;
  private static instance: SmtpEmailService;

  constructor(sender: string = config.mail.sender) {
    super(sender);

    this.mailService = new Email({
      message: {
        from: sender,
      },
      views: {
        root: "src/emails",
        options: {
          extension: "hbs",
          engineSource: {
            hbs: Handlebars,
          },
        },
      },
      send: config.env !== "development",
      preview: config.env === "development",
      transport: createTransport({
        host: "smtp.gmail.com",
        port: 587,
        requireTLS: true,
        auth: {
          user: config.mail.sender,
          pass: config.mail.smtppass,
        },
      }),
      subjectPrefix: `[${config.env}] `,
    });
  }

  /**
   * Gets or create an instance of the mailgun email service
   * @returns {SmtpEmailService}
   */
  static getInstance(): SmtpEmailService {
    if (!this.instance) {
      this.instance = new SmtpEmailService();
    }
    return this.instance;
  }

  async send(options: IEmailOptions): Promise<MailResponse> {
    try {
      const data = await this.mailService.send({
        ...options,
        locals: options.locals,
      });
      return { data };
    } catch (error: any) {
      logger.log(error);
      return { error };
    }
  }

  async render(options: IEmailOptions): Promise<MailResponse> {
    try {
      const data = await this.mailService.render(options.template, {
        locals: options.locals,
      });
      return { data };
    } catch (error: any) {
      logger.error(`${error}`);
      return { error };
    }
  }
}
