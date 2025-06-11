import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const cookieName = "auth-token";

export async function signAuthToken(payload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    return token;
  } catch (error) {
    throw new Error("Token signing failed");
  }
}

export async function verifyAuthToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error("Token verification failed");
  }
}

export async function setAuthCookie(token) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
  } catch (error) {
    throw new Error("Setting cookie failed");
  }
}

export async function getAuthToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName)?.value;
    return token;
  } catch (error) {
    throw new Error("Getting token from cookie failed");
  }
}

export async function removeAuthCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(cookieName);
  } catch (error) {
    throw new Error("Removing cookie failed");
  }
}
