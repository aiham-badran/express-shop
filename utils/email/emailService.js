const nodemailer = require("nodemailer");
const nodemailerPug = require("nodemailer-pug-engine");
const { resolve } = require("path");

/**
 * @description Creates an email transporter using nodemailer. The transporter is configured to use the
 * host, port, and authentication details from environment variables.
 *
 * @constant {object} transporter
 * @property {string} host - The email server's host, retrieved from EMAIL_HOST environment variable.
 * @property {number} port - The port number of the email server, retrieved from EMAIL_PORT environment variable.
 * @property {object} auth - Authentication details for the email server.
 * @property {string} auth.user - The username for authentication, retrieved from EMAIL_USER environment variable.
 * @property {string} auth.pass - The password for authentication, retrieved from EMAIL_PASS environment variable.
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @description Configures the transporter to use Pug templates for compiling email content.
 *
 * @method pugEngine
 * @param {string} templateDir - The directory where the Pug templates are stored.
 */
transporter.use(
  "compile",
  nodemailerPug.pugEngine({
    templateDir: resolve(process.cwd(), "views/templates/Emails"),
  })
);

/**
 * Sends an email using the configured transporter and Pug template engine.
 *
 * @function sendEmail
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} template - The name of the Pug template to use for the email body.
 * @param {object} context - The context to pass to the template, containing dynamic data for rendering.
 * @returns {Promise} A promise that resolves when the email is successfully sent, or rejects with an error.
 *
 * @example
 * sendEmail('example@example.com', 'Welcome!', 'welcome-template', { name: 'John' })
 *   .then(() => console.log('Email sent successfully'))
 *   .catch(err => console.error('Error sending email', err));
 */
exports.sendEmail = (to, subject, template, context) => {
  const mailOptions = {
    from: process.env.EMAIL_FORM_INFO,
    to,
    subject,
    template,
    ctx: context,
  };

  return transporter.sendMail(mailOptions);
};
