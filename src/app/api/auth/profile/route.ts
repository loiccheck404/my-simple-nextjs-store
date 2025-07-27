// app/api/auth/profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { userDb } from "@/lib/db";

// Helper function to extract and verify JWT token
async function verifyToken(request: NextRequest) {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get("authorization");
    let token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    // If not in header, try cookie
    if (!token) {
      token = request.cookies.get("auth_token")?.value || null;
    }

    if (!token) {
      return null;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      name: string;
    };

    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// GET /api/auth/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get fresh user data from database
    const user = await userDb.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user profile (exclude sensitive data)
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
    };

    return NextResponse.json(userResponse, { status: 200 });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/auth/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const decoded = await verifyToken(request);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, avatar } = await request.json();

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // Prepare updates object
    const updates: { name?: string; avatar?: string } = {
      name: name.trim(),
    };

    if (avatar) {
      updates.avatar = avatar;
    }

    // Update user in database
    const updatedUser = await userDb.update(decoded.userId, updates);

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return updated user profile
    const userResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    };

    return NextResponse.json(
      {
        user: userResponse,
        message: "Profile updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
