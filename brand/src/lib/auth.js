import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Secret key used to sign the JWT token (from environment variable)
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const cookieName = "auth-token";

// Function to sign JWT token with the given payload
export async function signAuthToken(payload) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Set the expiration time for 24 hours
      .sign(secret); // Sign the JWT with the secret

    return token;
  } catch (error) {
    throw new Error("Token signing failed: " + error.message);
  }
}

// Function to verify the JWT token and return the payload
export async function verifyAuthToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret); // Verify the token with the secret
    return payload; // Return the decoded payload
  } catch (error) {
    throw new Error("Token verification failed: " + error.message);
  }
}

// Function to set the JWT token in the cookie
export async function setAuthCookie(token) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(cookieName, token, {
      httpOnly: true, // Ensures cookie can't be accessed via JavaScript (XSS protection)
      secure: process.env.NODE_ENV === "production", // Only set secure cookies in production
      sameSite: "lax", // Controls cookie sending behavior in cross-site requests
      path: "/", // Cookie is available for the entire domain
      maxAge: 60 * 60 * 24, // Cookie expiration time (1 day)
    });
  } catch (error) {
    throw new Error("Failed to set auth cookie: " + error.message);
  }
}

// Function to get the JWT token from the cookie
export async function getAuthToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName)?.value; // Get the token from the cookie
    return token; // Return the token value (or undefined if not found)
  } catch (error) {
    throw new Error("Failed to retrieve auth token: " + error.message);
  }
}

// Function to remove the JWT token from the cookie
export async function removeAuthCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(cookieName); // Delete the cookie
  } catch (error) {
    throw new Error("Failed to remove auth cookie: " + error.message);
  }
}
