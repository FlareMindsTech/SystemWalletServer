import nodemailer from "nodemailer";

export const sendUserMail = async (
    email,
    userName,
    mobileNo,
    password,
    referenceID 
) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER, 
                pass: process.env.MAIL_PASS  
            }
        });

        
        await transporter.verify();
        console.log("Gmail SMTP Connection Verified");

        const mailOptions = {
            from: `"ARRA Admin" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Your ARRA Account Login Credentials",
            html: `
                <div style="font-family:Arial, sans-serif; line-height:1.6; color: #333;">
                    <h2>Welcome to ARRA</h2>
                    <p>Your account has been successfully created.</p>

                    <table style="border-collapse:collapse; width: 100%; max-width: 400px;">
                        <tr>
                            <td style="padding: 5px 0;"><b>Reference ID</b></td>
                            <td>: ${referenceID}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0;"><b>User Name</b></td>
                            <td>: ${userName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0;"><b>Mobile Number</b></td>
                            <td>: ${mobileNo}</td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0;"><b>Password</b></td>
                            <td style="color: #d9534f;">: <b>${password}</b></td>
                        </tr>
                    </table>

                   

                    <p>Regards,<br/><b>ARRA Team</b></p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return info;

    } catch (error) {
        console.error("Email failed:", error.message);
        throw error;
    }
};