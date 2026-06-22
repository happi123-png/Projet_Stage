const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

async function envoyerOtp(email, code, nomUtilisateur) {
    await transporter.sendMail({
        from: `"HAIR COSMETIC" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'HAIR COSMETIC : Code de vérification OTP',
        text: `Bonjour ${nomUtilisateur},\n\nVotre code de vérification est : ${code}.\nIl expire dans 5 minutes.`,

        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                <h2 style="color: #bc964b; text-align: center;">HAIR COSMETIC</h2>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                
                <p>Bonjour <strong>Mme/Mr ${nomUtilisateur}</strong>,</p>
                
                <p>Nous avons reçu une demande de vérification pour votre compte lié à notre application de gestion de salon de coiffure.</p>
                
                <div style="background-color: #f9f9f9; border-left: 4px solid #bc964b; padding: 15px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: #666;">Votre code de vérification unique est :</p>
                    <h1 style="margin: 10px 0; font-size: 32px; letter-spacing: 5px; color: #bc964b;">${code}</h1>
                </div>
                
                <p style="color: #d9534f; font-size: 14px;">
                    ⚠️ <strong>Sécurité :</strong> Ce code expirera dans <strong>5 minutes</strong>. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
                </p>
                
                <p>Si vous rencontrez des difficultés, notre équipe technique reste à votre entière disposition.</p>
                
                <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
                <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
                    Cordialement,<br />
                    <strong>L’équipe technique HAIR COSMETIC</strong>
                </p>
            </div>
        `
    });
}

module.exports = { envoyerOtp };