import { alphabet, generateRandomString } from "oslo/crypto";
import { createDate, TimeSpan } from "oslo";
import { User } from "lucia";
import { Resend } from "resend";
import prisma from "./prisma";

export const generateEmailVerificationCode = async (
  userId: string,
  email: string,
): Promise<string> => {
  await prisma.emailVerificationCode.deleteMany({
    where: { userId },
  });

  const code = generateRandomString(6, alphabet("0-9"));

  await prisma.emailVerificationCode.create({
    data: {
      userId,
      email,
      code,
      expires_at: createDate(new TimeSpan(10, "m")),
    },
  });

  return code;
};

export const verifyVerificationCode = async (
  user: User,
  code: string,
): Promise<boolean> => {
  // Find the verification code
  const databaseCode = await prisma.emailVerificationCode.findUnique({
    where: { userId: user.id },
  });

  // Validation checks
  if (!databaseCode || databaseCode.code !== code) {
    return false;
  }

  // Check if code is expired
  if (new Date() > databaseCode.expires_at) {
    // Delete expired code
    await prisma.emailVerificationCode.delete({
      where: { id: databaseCode.id },
    });
    return false;
  }

  // Get the user from the database to check the email
  const userFromDb = await prisma.user.findUnique({
    where: { id: user.id },
    select: { email: true },
  });

  // Check if the email matches
  if (!userFromDb?.email || databaseCode.email !== userFromDb.email) {
    return false;
  }

  // Delete the code as it's been used
  await prisma.emailVerificationCode.delete({
    where: { id: databaseCode.id },
  });

  return true;
};

export const sendVerificationEmail = async (
  email: string,
  code: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Initialize Resend with API key
    const resend = new Resend(process.env.RESEND_API_KEY);

    // For development, log the code to console as well
    if (process.env.NODE_ENV !== "production") {
      console.log(`VERIFICATION CODE for ${email}: ${code}`);
    }

    // Send email (without destructuring unused variables)
    const result = await resend.emails.send({
      from: "onboarding@resend.dev", // Use a domain you've verified in Resend
      to: email,
      subject: "Verify your PlateMates account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your PlateMates Account</h2>
          <p>Thanks for signing up! Please use the following code to verify your email address:</p>
          <div style="background-color: #f4f4f4; padding: 12px 16px; border-radius: 4px; font-size: 24px; letter-spacing: 2px; text-align: center; margin: 24px 0;">
            <strong>${code}</strong>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't create an account with PlateMates, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (result.error) {
      console.error("Error from Resend:", result.error);
      return { success: false, error: "Failed to send verification email" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      error: "An unexpected error occurred while sending verification email",
    };
  }
};
