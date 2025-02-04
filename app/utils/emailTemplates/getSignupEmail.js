export const getSignupEmail = (full_name, signupUrl) => {
  return {
    subject: "Complete Your Signup",
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-top: 5px solid #6EC5FF; padding: 20px; background: #ffffff;"> 
        <h2 style="color: #333; font-weight: 600;">Hi ${full_name},</h2>
        <p style="color: #555; font-size: 16px;">Welcome to Zippy! Click the button below to complete your signup:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${signupUrl}" 
             style="background: #6EC5FF; color: #ffffff; text-decoration: none; padding: 12px 24px; font-size: 16px; font-weight: 600; border-radius: 8px; display: inline-block; font-family: 'Inter', sans-serif;">
            Complete Signup
          </a>
        </div>
        <p style="color: #555; font-size: 14px;">If the button above doesn’t work, copy and paste this link into your browser:</p>
        <p style="font-size: 12px; color: #888;">If you didn’t request this, please ignore this email.</p>
      </div>
    `,
  };
};
