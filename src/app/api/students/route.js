import { NextResponse } from "next/server";
import { StudentModel } from "../../../models/Student";

export async function GET() {
  try {
    const students = await StudentModel.getAllStudents();
    return NextResponse.json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const marker = searchParams.get("marker");

    if (!email || !marker) {
      return NextResponse.json(
        { error: "Email and marker are required" },
        { status: 400 }
      );
    }

    await StudentModel.removeMarker(email, marker);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing marker:", error);
    return NextResponse.json(
      { error: "Failed to remove marker" },
      { status: 500 }
    );
  }
}
