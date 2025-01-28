"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

function getEmailTemplate(submission: {
  firstName: string
  lastName: string
  email: string
  message: string
}) {
  return {
    subject: "New Contact Form Submission - Procurement Monitoring System",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f6f9fc;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 40px 20px 40px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td>
                            <h1 style="margin: 0; font-size: 24px; color: #2E8B57; font-weight: bold;">
                              New Contact Form Submission
                            </h1>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 20px 40px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="padding: 0 0 20px 0;">
                            <p style="margin: 0; color: #666666; font-size: 16px; line-height: 24px;">
                              You have received a new contact form submission. Here are the details:
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 20px; background-color: #f8faf8; border-radius: 6px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td width="120" style="color: #2E8B57; font-weight: 600; padding-bottom: 10px;">Name:</td>
                                <td style="color: #333333; padding-bottom: 10px;">${submission.firstName} ${submission.lastName}</td>
                              </tr>
                              <tr>
                                <td width="120" style="color: #2E8B57; font-weight: 600; padding-bottom: 10px;">Email:</td>
                                <td style="color: #333333; padding-bottom: 10px;">
                                  <a href="mailto:${submission.email}" style="color: #2E8B57; text-decoration: none;">
                                    ${submission.email}
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td width="120" style="color: #2E8B57; font-weight: 600; padding-bottom: 10px;">Date:</td>
                                <td style="color: #333333; padding-bottom: 10px;">${new Date().toLocaleString()}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 20px 0;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td style="color: #2E8B57; font-weight: 600; padding-bottom: 10px;">Message:</td>
                              </tr>
                              <tr>
                                <td style="color: #333333; line-height: 24px; padding: 15px; background-color: #f8faf8; border-radius: 6px;">
                                  ${submission.message.replace(/\n/g, "<br>")}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px 40px 40px 40px;">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="border-top: 1px solid #e9ecef; padding-top: 20px;">
                            <p style="margin: 0; color: #666666; font-size: 14px; line-height: 21px;">
                              This is an automated message from the Procurement Monitoring System.
                              Please respond to the sender using their provided email address.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- System Info -->
                <table width="600" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding: 20px 0; text-align: center;">
                      <p style="margin: 0; color: #8898aa; font-size: 12px;">
                        Procurement Monitoring System © ${new Date().getFullYear()}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
New Contact Form Submission

From: ${submission.firstName} ${submission.lastName}
Email: ${submission.email}
Date: ${new Date().toLocaleString()}

Message:
${submission.message}

--
Procurement Monitoring System
    `,
  }
}

export async function submitContactForm(formData: FormData) {
  try {
    const firstName = formData.get("firstName")
    const lastName = formData.get("lastName")
    const email = formData.get("email")
    const message = formData.get("message")

    if (!firstName || !email || !message) {
      throw new Error("Missing required fields")
    }

    const submission = {
      firstName: firstName.toString(),
      lastName: lastName ? lastName.toString() : "",
      email: email.toString(),
      message: message.toString(),
    }

    console.log("Attempting to send email with Resend...")
    console.log("Admin Email:", process.env.ADMIN_EMAIL)

    const emailTemplate = getEmailTemplate(submission)
    const result = await resend.emails.send({
      from: "Procurement Monitoring System <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL as string,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text, 
    })

    console.log("Resend API Response:", result)

    if (result.error) {
      throw new Error(`Resend API error: ${result.error.message}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

