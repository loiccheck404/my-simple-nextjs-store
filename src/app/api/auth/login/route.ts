// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await userDb.findByEmail(email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token with proper typing
    const payload = {
      userId: user.id,
      email: user.email,
      name: user.name,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const options: jwt.SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN as string) || "7d",
    };

    const token = jwt.sign(payload, secret, options);

    // Remove password hash from response
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };

    // Create response with HTTP-only cookie
    const response = NextResponse.json(
      {
        user: userResponse,
        token,
        message: "Login successful",
      },
      { status: 200 }
    );

    // Set HTTP-only cookie for additional security
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
