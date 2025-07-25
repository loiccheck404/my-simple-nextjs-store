import jwt from "jsonwebtoken";

export async function verifyAuth(request) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return { success: false, error: "No token provided" };
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    return { success: true, user: decoded };
  } catch (error) {
    return { success: false, error: "Invalid token" };
  }
}

export async function verifyAdmin(request) {
  const authResult = await verifyAuth(request);

  if (!authResult.success) {
    return authResult;
  }

  if (authResult.user.role !== "admin") {
    return { success: false, error: "Admin access required" };
  }

  return authResult;
}

// Helper function to extract user ID from request
export async function getUserFromRequest(request) {
  const authResult = await verifyAuth(request);
  if (!authResult.success) {
    return null;
  }
  return authResult.user;
}
