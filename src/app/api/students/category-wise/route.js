import { NextResponse } from "next/server";
import { StudentModel } from "@/models/Student";

export async function GET() {
  try {
    const counts = await StudentModel.getCategoryWiseCount();
    return NextResponse.json({ success: true, data: counts });
  } catch (error) {
    console.error("Error fetching category-wise student count:", error);
    return NextResponse.json(
      { error: "Failed to get category-wise count" },
      { status: 500 }
    );
  }
}
