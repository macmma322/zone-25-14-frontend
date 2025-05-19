// File: src/middleware/uploadMiddleware.js
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface DecodedToken {
  userId: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export async function getServerUser(): Promise<{ token: string; decoded: DecodedToken } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as DecodedToken;
    return { token, decoded };
  } catch {
    return null;
  }
}
