require("dotenv").config()
const nodemailer = require("nodemailer")
const {getMaxListeners} = require("process")

const host = process.env.HOST || "http://localhost:3001"
const user = process.env.NM_USER

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: process.env.NM_PASS,
  },
})

module.exports.sendValidationEmail = (email, activationToken, name) => {
  transport.sendMail({
    to: email,
    from: `Victs team <${user}>`,
    subject: "Activate your user here!",
    html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to VICTS activation</title>
        <style
          type="text/css"
          style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%"
        >
          table {
            color: #fff;
          }

          .banner {
            height: 425px;
          }

          h2 {
            text-transform: uppercase;
          }
    
          @media (max-width: 570px) {
            table {
              width: 95%;
            }
          }
        </style>
      </head>
      <body
        width="100%"
        style="
          margin: 0 !important;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
          width: 100% !important;
          mso-table-lspace: 0pt !important;
          mso-table-rspace: 0pt !important;
          background:#1d1a2e;
          padding: 60px 0;
        "
      >
      
        <table cellpading="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="800"
                  align="center"
                  style="border: solid 2px #fece07; border-radius: 24px; overflow: hidden;"
                >
                <tr background="https://res.cloudinary.com/dutvbml2i/image/upload/v1603448337/victs/mail-banner_p5abyc.jpg">
                <td class="banner"></td>
                </tr>
                  <tr bgcolor="#1d1a2e">
                    <td align="center" style="padding-bottom: 60px;">
                      <h2>confirmation email</h2>
                      <h4>Hello ${name}!</h4>
                      <h4>Great to see you enjoying our awesome team!</h4>
                      <p>
                      <a href="${host}/activate/${activationToken}" style="color: #fece07;"
                        >Please confirm your account
                        clicking here</a>
                      </p>
                      <p style="padding-top: 60px">You are doing awesome!</p>
                    </td>
                  </tr>
                </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
		`,
  })
}


module.exports.sendReservationEmail = (email, name) => {
  transport.sendMail({
    to: email,
    from: `Victs team <${user}>`,
    subject: "You hace a place in the class",
    html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to VICTS activation</title>
        <style
          type="text/css"
          style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%"
        >
          table {
            color: #fff;
          }

          .banner {
            height: 425px;
          }

          h2 {
            text-transform: uppercase;
          }
    
          @media (max-width: 570px) {
            table {
              width: 95%;
            }
          }
        </style>
      </head>
      <body
        width="100%"
        style="
          margin: 0 !important;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
          width: 100% !important;
          mso-table-lspace: 0pt !important;
          mso-table-rspace: 0pt !important;
          background:#1d1a2e;
          padding: 60px 0;
        "
      >
      
        <table cellpading="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center">
                <table
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  width="800"
                  align="center"
                  style="border: solid 2px #fece07; border-radius: 24px; overflow: hidden;"
                >
                <tr background="https://res.cloudinary.com/dutvbml2i/image/upload/v1603448337/victs/mail-banner_p5abyc.jpg">
                <td class="banner"></td>
                </tr>
                  <tr bgcolor="#1d1a2e">
                    <td align="center" style="padding-bottom: 60px;">
                      <h2>confirmation email</h2>
                      <h4>Hello ${name}!</h4>
                      <h4>Great to see you enjoying our awesome team!</h4>
                      <p>
                      <a href="${host}/activate/${activationToken}" style="color: #fece07;"
                        >Please confirm your account
                        clicking here</a>
                      </p>
                      <p style="padding-top: 60px">You are doing awesome!</p>
                    </td>
                  </tr>
                </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
		`,
  })
}