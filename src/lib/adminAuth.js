import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_token";
const ONE_DAY = 60 * 60 * 24;

export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export function generateAdminToken(admin) {
  return jwt.sign(
    {
      id: admin.id,
      name: admin.name,
      username: admin.username,
    },
    process.env.JWT_SECRET || "change_this_secret_key",
    { expiresIn: "1d" },
  );
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "change_this_secret_key");
  } catch {
    return null;
  }
}

export async function getAdminFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_DAY,
  };
}

export { COOKIE_NAME };
