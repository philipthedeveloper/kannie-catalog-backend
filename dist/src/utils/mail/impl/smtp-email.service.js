"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmtpEmailService = void 0;
const email_templates_1 = __importDefault(require("email-templates"));
const mail_service_1 = require("../mail.service");
const config_1 = require("@/config");
const nodemailer_1 = require("nodemailer");
const logging_1 = require("@/logging");
const handlebars_1 = __importDefault(require("handlebars"));
class SmtpEmailService extends mail_service_1.MailService {
    constructor(sender = config_1.config.mail.sender) {
        super(sender);
        this.mailService = new email_templates_1.default({
            message: {
                from: sender,
            },
            views: {
                root: "src/emails",
                options: {
                    extension: "hbs",
                    engineSource: {
                        hbs: handlebars_1.default,
                    },
                },
            },
            send: config_1.config.env !== "development",
            preview: config_1.config.env === "development",
            transport: (0, nodemailer_1.createTransport)({
                host: "smtp.gmail.com",
                port: 587,
                requireTLS: true,
                auth: {
                    user: config_1.config.mail.sender,
                    pass: config_1.config.mail.smtppass,
                },
            }),
            subjectPrefix: `[${config_1.config.env}] `,
        });
    }
    /**
     * Gets or create an instance of the mailgun email service
     * @returns {SmtpEmailService}
     */
    static getInstance() {
        if (!this.instance) {
            this.instance = new SmtpEmailService();
        }
        return this.instance;
    }
    send(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.mailService.send(Object.assign(Object.assign({}, options), { locals: options.locals }));
                return { data };
            }
            catch (error) {
                logging_1.logger.log(error);
                return { error };
            }
        });
    }
    render(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.mailService.render(options.template, {
                    locals: options.locals,
                });
                return { data };
            }
            catch (error) {
                logging_1.logger.error(`${error}`);
                return { error };
            }
        });
    }
}
exports.SmtpEmailService = SmtpEmailService;
