/**
 * Sends thank you emails to both rescuer and reporter
 * Configure SMTP in .env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
 * If not configured, logs to console (dev mode)
 */
let transporter = null;

const initTransporter = () => {
  if (transporter) return transporter;
  try {
    const nodemailer = require('nodemailer');
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
    if (SMTP_HOST && SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT || 587,
        secure: SMTP_PORT == 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      });
    }
  } catch (e) {
    console.log('Nodemailer not installed. Run: npm install nodemailer');
  }
  return transporter;
};

const sendMail = async (to, subject, html) => {
  const t = initTransporter();
  const from = process.env.MAIL_FROM || 'RescuePaw <noreply@rescuepaw.org>';
  if (t) {
    await t.sendMail({ from, to, subject, html });
  } else {
    console.log(`[Email] To: ${to} | ${subject}\n${html.substring(0, 200)}...`);
  }
};

exports.sendThankYouEmails = async (incident) => {
  const rescuer = incident.assignedRescuer;
  const reporter = incident.reporter;
  const note = incident.thankYouNote || 'Thank you for your kindness and compassion!';

  const rescuerName = rescuer.name || 'Rescuer';
  const reporterName = reporter.name || 'Reporter';

  // Email to Rescuer
  const rescuerHtml = `
    <h2>Thank You for Rescuing! 🐾</h2>
    <p>Dear <strong>${rescuerName}</strong>,</p>
    <p>${reporterName} wants to thank you for rescuing the injured ${incident.animalType}.</p>
    <blockquote style="border-left:4px solid #f59e0b; padding:12px; margin:16px 0; background:#fffbeb;">
      "${note}"
    </blockquote>
    <p>Your kindness saves lives. RescuePaw and the community thank you for being a hero! 💚</p>
    <p>— RescuePaw Team</p>
  `;

  // Email to Reporter
  const reporterHtml = `
    <h2>Thank You for Caring! 🐾</h2>
    <p>Dear <strong>${reporterName}</strong>,</p>
    <p>Your report helped save an injured ${incident.animalType}. <strong>${rescuerName}</strong> completed the rescue.</p>
    <p>Both of you have kind hearts. Thank you for being part of the RescuePaw community!</p>
    <p>— RescuePaw Team</p>
  `;

  try {
    if (rescuer?.email) await sendMail(rescuer.email, 'Thank you for rescuing! - RescuePaw', rescuerHtml);
    if (reporter?.email) await sendMail(reporter.email, 'Your rescue was completed - RescuePaw', reporterHtml);
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
};
