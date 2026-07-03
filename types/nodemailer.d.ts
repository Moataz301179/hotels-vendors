declare module "nodemailer" {
  interface Transporter {
    sendMail(mailOptions: any): Promise<any>;
    verify(): Promise<boolean>;
  }
  function createTransport(options: any): Transporter;
  export { createTransport, Transporter };
}
