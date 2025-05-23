import { NextResponse } from "next/server";
import { StudentModel } from "../../../models/Student";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const marker = formData.get("marker");

    if (!file || !marker) {
      return NextResponse.json(
        { error: "File and marker are required" },
        { status: 400 }
      );
    }

    // Read and parse CSV content
    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());

    if (lines.length <= 1) {
      return NextResponse.json(
        { error: "CSV file must contain data rows" },
        { status: 400 }
      );
    }

    // Skip header row and process data
    const dataLines = lines.slice(1);
    const results = {
      updated: 0,
      created: 0,
      errors: [],
    };

    for (let i = 0; i < dataLines.length; i++) {
      try {
        const row = dataLines[i]
          .split(",")
          .map((cell) => cell.trim().replace(/"/g, ""));

        if (row.length < 2) {
          results.errors.push(`Row ${i + 2}: Invalid format`);
          continue;
        }

        const [emailId, studentName] = row;

        if (!emailId || !studentName) {
          results.errors.push(`Row ${i + 2}: Missing email or name`);
          continue;
        }

        // Check if student exists
        const existingStudent = await StudentModel.findByEmail(emailId);

        if (existingStudent) {
          // Add marker if not already present
          if (!existingStudent.markers.includes(marker)) {
            await StudentModel.addMarker(emailId, marker);
            results.updated++;
          }
        } else {
          // Create new student
          await StudentModel.addStudent({
            emailId,
            studentName,
            marker,
          });
          results.created++;
        }
      } catch (error) {
        results.errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
