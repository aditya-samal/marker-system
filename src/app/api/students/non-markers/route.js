import { NextResponse } from "next/server";
import { StudentModel } from "@/models/Student";

export async function GET() {
  try {
    const students = await StudentModel.getAllNonMarkers();
    return NextResponse.json({ students });
  } catch (error) {
    console.error("Error fetching non-marker students:", error);
    return NextResponse.json(
      { error: "Failed to fetch non-marker students" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const result = await StudentModel.deleteAllNonMarkers();
    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting non-marker students:", error);
    return NextResponse.json(
      { error: "Failed to delete non-marker students" },
      { status: 500 }
    );
  }
}
