import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { generateIdFromEntropySize } from "lucia";
import prisma from "./prisma";
import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function createPasswordResetToken(
  userId: string,
): Promise<string> {
  console.log("Creating password reset token for user:", userId);

  try {
    // Invalidate all existing tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: userId,
      },
    });

    // Generate a new token (40 characters)
    const tokenId = generateIdFromEntropySize(25);

    // Hash the token for secure storage
    const tokenHash = encodeHex(
      await sha256(new TextEncoder().encode(tokenId)),
    );

    console.log("Token generated, hash:", tokenHash.substring(0, 10) + "...");

    // Store the token in the database - using expires_at to match schema
    const token = await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt: createDate(new TimeSpan(2, "h")), // Token valid for 2 hours
      },
    });

    console.log("Token stored in database, ID:", token.id);

    return tokenId;
  } catch (error) {
    console.error("Error creating password reset token:", error);
    throw error;
  }
}

export async function validatePasswordResetToken(
  token: string,
): Promise<string | null> {
  console.log(
    "Validating password reset token:",
    token.substring(0, 5) + "...",
  );

  try {
    // Hash the provided token
    const tokenHash = encodeHex(await sha256(new TextEncoder().encode(token)));
    console.log(
      "Token hash for validation:",
      tokenHash.substring(0, 10) + "...",
    );

    // Find the token in the database
    const storedToken = await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

    console.log("Token found in database:", !!storedToken);

    // If token doesn't exist or is expired, return null
    if (!storedToken) {
      console.log("No matching token found in database");
      return null;
    }

    const isValid = isWithinExpirationDate(storedToken.expiresAt);
    console.log("Token expiration:", storedToken.expiresAt);
    console.log("Token is within expiration date:", isValid);

    if (!isValid) {
      console.log("Token is expired");
      return null;
    }

    // Return the user ID associated with this token
    console.log("Token is valid for user:", storedToken.userId);
    return storedToken.userId;
  } catch (error) {
    console.error("Error validating password reset token:", error);
    return null;
  }
}

export async function deletePasswordResetToken(token: string): Promise<void> {
  try {
    // Hash the token to find it in the database
    const tokenHash = encodeHex(await sha256(new TextEncoder().encode(token)));

    // Delete the token
    await prisma.passwordResetToken.deleteMany({
      where: {
        tokenHash,
      },
    });

    console.log("Password reset token deleted");
  } catch (error) {
    console.error("Error deleting password reset token:", error);
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Sending password reset email to:", email);
    console.log("Reset link:", resetLink);

    const result = await resend.emails.send({
      from: "PlateMates <itab.ghazouani@gmail.com>",
      to: email,
      subject: "Reset Your PlateMates Password",
      html: `
        <h1>Reset Your Password</h1>
        <p>Someone (hopefully you) has requested to reset your password for PlateMates.</p>
        <p>Click the link below to set a new password. This link will expire in 2 hours.</p>
        <p>
          <a href="${resetLink}" style="padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">
            Reset Your Password
          </a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>The link expires in 2 hours.</p>
      `,
    });

    if (result.error) {
      console.error("Failed to send reset email:", result.error);
      return { success: false, error: result.error.message };
    }

    console.log("Reset email sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending reset email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
