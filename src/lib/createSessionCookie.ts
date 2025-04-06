import { cookies } from "next/headers";
import { lucia } from "@/auth";

export const createSessionCookie = async (userId: string) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return session;
};
