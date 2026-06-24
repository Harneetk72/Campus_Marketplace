import nodemailer from "nodemailer";

export const sendEmail = async (
  to,
  subject,
  text
) => {

  try {

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {

          user: process.env.EMAIL,

          pass: process.env.PASSWORD,

        },

      });

    await transporter.sendMail({

      from: process.env.EMAIL,

      to,

      subject,

      text,

    });

  } catch (error) {

    console.log(error);

  }

};