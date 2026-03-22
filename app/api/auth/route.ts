import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Simulate authentication logic (replace with real authentication)
    if (email === "user@example.com" && password === "password") {
      return new Response(JSON.stringify({ message: "Authentication successful" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ message: "An error occurred during authentication" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}