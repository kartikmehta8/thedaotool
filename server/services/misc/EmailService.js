const sendMail = require('../../utils/mailer');

class EmailService {
  async sendVerificationEmail({ to, token }) {
    const html = `
      <p>Please verify your email using the token below:</p>
      <strong>${token}</strong>
      <p>This token expires in 15 minutes.</p>
    `;

    return sendMail({
      to,
      subject: 'Verify Your Email – The DAO Tool',
      text: `Verify your email`,
      html,
    });
  }

  async sendForgotPasswordEmail({ to, token }) {
    const html = `
      <p>You requested a password reset. The token is:</p>
      <p><strong>${token}</strong></p>
      <p>This token will expire in 15 minutes. If you didn’t request this, you can ignore the message.</p>
    `;

    return sendMail({
      to,
      subject: 'Password Reset – The DAO Tool',
      text: `Reset your password`,
      html,
    });
  }
}

module.exports = new EmailService();
