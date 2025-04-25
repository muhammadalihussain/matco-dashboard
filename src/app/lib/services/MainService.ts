import nodemailer from "nodemailer";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "2500"),
  secure: process.env.SMTP_SECURE === "false",

  // host: "192.168.11.17",
  // port: 2500,
  // secure: false,
  // requireTLC: true,
  // secureConnection: false, // use SSL

  // here it goes

  // auth: {
  //   user: 'erp.workflow@matcofoods.com', // TODO: your gmail account
  //   pass: 'W0rk-1964$1' // TODO: your gmail password
  // },
  tls: {
    rejectUnauthorized: false,
  },
});

export const SendEmail = async (name: string, email: string, token: string) => {
  const info = await transporter.sendMail({
    from: "erp.workflow@matcofoods.com", // sender address
    to: email, // list of receivers
    subject: "forget password", // Subject line
    // text: "Hello world?", // plain text body
    html: `
    
                Dear,${name},
                click here
                
                <a href="${API_URL}/updatepassword?token=${token}">click here to update</a>
    `, // html body
  });
};
