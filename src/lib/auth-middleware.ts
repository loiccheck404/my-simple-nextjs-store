import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface AuthResult {
  success: boolean;
  user?: {
    userId: string;
    email: string;
    role: string;
  };
  error?: string;
}

// Verify JWT token and return user info
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get token from Authorization header or x-auth-token header
    const authHeader = request.headers.get("authorization");
    const tokenHeader = request.headers.get("x-auth-token");

    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (tokenHeader) {
      token = tokenHeader;
    }

    if (!token) {
      return {
        success: false,
        error: "No token provided",
      };
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET not configured");
    }

    const decoded = jwt.verify(token, jwtSecret) as any;

    // Get user from database to ensure they still exist and get latest info
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      user: {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Auth verification error:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        success: false,
        error: "Invalid token",
      };
    }

    if (error instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        error: "Token expired",
      };
    }

    return {
      success: false,
      error: "Authentication failed",
    };
  }
}

// Verify admin role
export async function verifyAdmin(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  if (authResult.user?.role !== "ADMIN") {
    return {
      success: false,
      error: "Admin access required",
    };
  }

  return authResult;
}

// Helper function to get user ID from request (for convenience)
export async function getUserId(request: NextRequest): Promise<string | null> {
  const authResult = await verifyAuth(request);
  return authResult.success ? authResult.user!.userId : null;
}

// Verify user owns resource or is admin
export async function verifyOwnershipOrAdmin(
  request: NextRequest,
  resourceUserId: string
): Promise<AuthResult> {
  const authResult = await verifyAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  const isOwner = authResult.user!.userId === resourceUserId;
  const isAdmin = authResult.user!.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return {
      success: false,
      error: "Access denied",
    };
  }

  return authResult;
}
