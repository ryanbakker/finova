import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/actions/user.actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      clerkId,
      email,
      username,
      firstName,
      lastName,
      photo,
      companyId,
      subscription,
    } = body;

    if (!clerkId || !email || !username) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await createUser({
      clerkId,
      email,
      username,
      firstName: firstName || "",
      lastName: lastName || "",
      photo: photo || "",
      companyId: companyId || clerkId, // Default to clerkId if not provided
      subscription: subscription || {
        plan: "free",
        status: "active",
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
