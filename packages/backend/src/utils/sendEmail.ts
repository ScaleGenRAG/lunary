import nodemailer from "nodemailer"
import sql from "./db"

export async function sendEmail(body: any) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    return console.warn(
      "SMTP environment variables are not set, skipping email sending",
    )
  }

  const blockList = await sql`select email from _email_block_list`
  const blockedEmails = blockList.map(({ email }) => email)

  if (blockedEmails.includes(body.to[0])) {
    return console.info("Email in the block list, skipping sending.")
  }

  if (body.to[0] === "test@lunary.ai") {
    return console.warn("Not sending email to test account")
  }

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    // Send email
    const info = await transporter.sendMail({
      from: body.from,
      to: body.to.join(", "),
      replyTo: body.reply_to,
      subject: body.subject,
      text: body.text,
    })

    console.info("Email sent: %s", info.messageId)
    return info
  } catch (error) {
    console.error("Error sending email:", error)
  }
}
