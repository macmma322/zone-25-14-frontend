import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getServerUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) return null;

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not defined");
    }

    interface JwtPayload {
      userId: string;
      username: string;
      role: string;
      [key: string]: unknown;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    return {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
    };
  } catch (err) {
    console.error("getServerUser error:", err);
    return null;
  }
}
