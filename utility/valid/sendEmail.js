import nodemailer from "nodemailer";


const sendEmail = async (email, otp, subject, message) => {
  let html = `
    <html>
      <head>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
            font-family: "Cairo", sans-serif;
          }
    
          table {
            width: 600px;
          }
        </style>
      </head>
      <body>
        <table align="center" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center" bgcolor="#f1f1f1" style="padding: 40px 0">
              <img
                src="https://i.ibb.co/CPcMjmk/rapid-Snip.png"
                alt="شعار البريد الإلكتروني"
                width="200"
                height="auto"
                style="display: block"
              />
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" style="padding: 40px 30px">
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  line-height: 30px;
                  color: #333333;
                  text-align: center;
                "
              >
                Hello
              </h1>
              <p
                style="
                  margin: 20px 0 30px 0;
                  font-size: 22px;
                  line-height: 24px;
                  color: #333333;
                  text-align: center;
                "
              >
                ${message}
              </p>
              <div style="text-align: center; color: #5a9300">
                <h1>${otp}</h1>
              </div>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f1f1f1" style="padding: 20px 30px; text-align: center">
              <p
                style="
                  margin: 0;
                  font-size: 14px;
                  line-height: 20px;
                  color: #333333;
                "
              >
                حقوق النشر © 2023. جميع الحقوق محفوظة.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
    
  `;

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "rapidsnip.shortlink@gmail.com",
      pass: "fkkeextmelerzzpc",
    },
  });


  try {
    let info = await transporter.sendMail({
      from: "RapidSnip",
      to: email,
      subject: subject,
      html: html,
    });

    return true;
  } catch (error) {
    return [false, error];
  }
}


export default sendEmail;