import { lucia, validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createSessionCookie } from "@/lib/createSessionCookie";

export { lucia, validateRequest, prisma, createSessionCookie };
