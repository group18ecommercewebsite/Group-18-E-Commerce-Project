import nodemailer from "nodemailer";

// Resend API configuration (for production)
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@hustshop.com';

// Gmail SMTP transporter (for local development)
const gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    }
});

// Send email via Resend API
async function sendViaResend(to, subject, text, html) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: FROM_EMAIL,
            to: [to],
            subject,
            text,
            html,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Resend API error');
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
}

// Send email via Gmail SMTP
async function sendViaGmail(to, subject, text, html) {
    const info = await gmailTransporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        text,
        html
    });
    return { success: true, messageId: info.messageId };
}

// Main function - uses Resend if API key exists, otherwise Gmail
async function sendEmail(to, subject, text, html) {
    try {
        if (RESEND_API_KEY) {
            console.log('📧 Sending email via Resend to:', to);
            return await sendViaResend(to, subject, text, html);
        } else {
            console.log('📧 Sending email via Gmail SMTP to:', to);
            return await sendViaGmail(to, subject, text, html);
        }
    } catch (error) {
        console.error('❌ Error sending email:', error);
        return { success: false, error: error.message };
    }
}

export { sendEmail };