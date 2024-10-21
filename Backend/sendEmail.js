const nodemailer = require('nodemailer');

// Create a transporter using Postale.io SMTP settings
const transporter = nodemailer.createTransport({
  host: 'mail.postale.io',
  port: 465,  // You can also use 587 for STARTTLS
  secure: true,  // Use SSL/TLS
  auth: {
    user: 'cameron@aquari.org',  // Replace with your Postale.io email
    pass: ''  // Replace with your Postale.io password
  }
});

// Define the email options
const mailOptions = {
  from: 'Aquari <cameron@aquari.org>',  // Sender address
  to: 'cameronclarke98@gmail.com',  // List of recipients
  subject: 'Your friend has invited you to try Aquari!',  // Subject line
  text: 'Hello world! This is a test email sent using Nodemailer and Postale.io',  // Plain text body
  html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0" />
    <title>Join Aquari - Your Friend Invited You!</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background-color: #000000;
      background-image: linear-gradient(to right, white 0%, rgba(255, 255, 255, 0) 2.5%, rgba(255, 255, 255, 0) 97.5%, white 100%), radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 5%), radial-gradient(circle at 80% 40%, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 8%), radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 6%),
        radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 4%), radial-gradient(circle at 10% 90%, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 7%), linear-gradient(to top, #000000 0%, #021019 70%, #031822 85%, #052130 100%);
      background-size: 100% 100%, 100% 100%, 50% 50%, 30% 30%, 40% 40%, 35% 35%, 100% 100%;
      background-position: 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0;
      background-repeat: no-repeat;
    ">
    <table
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="min-height: 100vh">
      <tr>
        <td
          align="center"
          valign="top"
          style="padding-top: 5vh; padding-bottom: 20px; padding-left: 20px; padding-right: 20px">
          <table
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="max-width: 600px">
            <tr>
              <td style="height: 30px"></td>
            </tr>
            <tr>
              <td
                align="center"
                valign="top"
                style="font-family: Arial, sans-serif; color: white; padding-bottom: 30px">
                <img
                  src="https://app.aquari.org/assets/logo-e4489121.png"
                  alt="Aquari Symbol"
                  style="max-width: 70px; height: auto; margin-right: 12px" />
                <img
                  src="https://app.aquari.org/assets/AquariTestLogo-caa7492c.png"
                  alt="Aquari Logo"
                  style="max-width: 200px; height: auto" />
              </td>
            </tr>
            <tr>
              <td
                align="left"
                valign="top"
                style="font-family: Arial, sans-serif; color: white">
                <div style="border-radius: 12px; background-color: rgba(5, 33, 48, 0.4); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); width: 100%; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05)">
                  <div style="border-top-left-radius: 12px; border-top-right-radius: 12px; background-color: rgba(5, 33, 48, 0.8); text-align: center; padding: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1)">
                    <div style="font-size: 20px; font-weight: bold; color: #ffffff; letter-spacing: -0.5px">You have been invited to Aquari!</div>
                  </div>

                  <div style="padding: 20px">
                    <p style="font-size: 16px; margin-top: 10px; line-height: 1.5; color: rgba(255, 255, 255, 0.9)">Hello there!</p>
                    <p style="font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.9)">Your friend believes you'd be a great addition to our community of ocean enthusiasts. They've invited you to join Aquari, an app and decentralized community dedicated to environmental protection.</p>

                    <p style="font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.9)">With Aquari, you can:</p>
                    <ul style="font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.9)">
                      <li>Participate in community clean-up challenges.</li>
                      <li>Connect with like-minded individuals passionate about our beautiful planet.</li>
                      <li>Work together with others to help heal our world!</li>
                    </ul>
                    <p style="font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.9)">Ready to dive in and make a difference?</p>
                    <img
                      src="https://i.postimg.cc/qRhtz7B8/pepinster.jpg"
                      alt="Aquari Cleanup"
                      style="max-width: 96%; margin-top: 0px; margin-bottom: 0px; height: auto; border-radius: 5px; display: block; margin-left: auto; margin-right: auto" />
                    <!-- Contest Section -->
                    <div style="margin-top: 30px; padding: 20px; background-color: rgba(44, 122, 123, 0.2); border-radius: 8px">
                      <h2 style="font-size: 18px; color: #2c7a7b; margin-bottom: 15px">Join Our Community Contest!</h2>
                      <p style="font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.9)">Your friend has invited you as part of our special contest. Follow these steps to participate:</p>
                      <ol style="font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.9)">
                        <li>Click on "Explore Aquari" below.</li>
                        <li>Login using your current email or Google account.</li>
                        <li>Open the Navigation Menu and click "Buy Aquari". Follow the steps to purchase.</li>
                        <li>Once you see your Aquari balance, navigate to the "Stake" page.</li>
                        <li>Stake Aquari to enter the contest. This counts towards your friend's invitation total!</li>
                        <li>
                          Join our Telegram group at
                          <a
                            href="https://t.me/aquariofficial"
                            style="color: #2c7a7b"
                            >https://t.me/aquariofficial</a
                          >
                          and introduce yourself.
                        </li>
                      </ol>
                      <p style="font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.9)">Your participation helps your friend win a grand prize of 100 Million Aquari tokens. Feel free to invite your own friends to increase both your chances!</p>
                    </div>

                    <!-- New Contest Rules Section -->
                    <div style="margin-top: 30px; padding: 20px; background-color: rgba(44, 122, 123, 0.2); border-radius: 8px;">
                      <h2 style="font-size: 18px; color: #2c7a7b; margin-bottom: 15px;">Contest Rules Made Simple</h2>
                      <p style="font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.9);">Here's how our community-building contest works:</p>
                      <ul style="font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.9);">
                        <li>The contest runs from August 10th to October 10th, 2024.</li>
                        <li>Your friend invited you to join and stake Aquari tokens.</li>
                        <li>When you stake, it counts as a point for your friend.</li>
                        <li>The more Aquari you stake, the more points your friend gets.</li>
                        <li>Every $100 worth of Aquari you stake equals 1 point for your inviter.</li>
                        <li>You can unstake your Aquari at any time, but doing so before November 10th, 2024, will disqualify you from the contest.</li>
                        <li>The person whose invitees have staked the most Aquari (in USD value) by the end of the contest wins the grand prize!</li>
                        <li>Feel free to invite your own friends too – you could be the grand prize winner!</li>
                      </ul>
                      <p style="font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.9);">Remember, this is not just about winning – it's about growing our community of ocean enthusiasts and making a real difference together!</p>
                    </div>

                    <div style="text-align: center; margin-top: 30px; margin-bottom: 30px">
                      <a
                        href="https://app.aquari.org/"
                        style="display: inline-block; background-color: #2c7a7b; background-image: linear-gradient(to bottom, #2c7a7b, #285e61); color: white; padding: 14px 28px; text-decoration: none; font-weight: 500; border-radius: 8px; font-size: 18px; letter-spacing: 0.5px; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1)"
                        >Explore Aquari</a
                      >
                    </div>
                    <p style="font-size: 14px; line-height: 1.5; font-style: italic; color: rgba(255, 255, 255, 0.8)">Together, we can make waves in ocean conservation. We're excited to have you on board!</p>

                    <p style="font-size: 16px; line-height: 1.5; color: rgba(255, 255, 255, 0.9); font-weight: bold; margin-top: 30px">NOTE: Aquari is in early development. You're joining a decentralized community building an environmental conservation organization. We're excited to have you contribute to this shared vision!</p>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td
                align="center"
                valign="top"
                style="font-family: Arial, sans-serif; color: rgba(255, 255, 255, 0.7); padding-top: 20px; font-size: 12px">
                <p>&copy; 2024 Aquari. All rights reserved.</p>
                <p>
                  If you don't want to receive these emails, you can
                  <a
                    href="#"
                    style="color: #2c7a7b"
                    >unsubscribe here</a
                  >.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`  // HTML body
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error occurred:', error.message);
  }
  console.log('Message sent successfully!');
  console.log('Message ID:', info.messageId);
});