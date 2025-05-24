import { NextResponse } from "next/server";
import { StudentModel } from "../../../models/Student";
import * as XLSX from "xlsx";

const modules = ["App", "Web", "ML", "Cyber", "Design", "CP"];

export async function GET() {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Create sheets for each modul (single marker students)
    for (const modul of modules) {
      const students = await StudentModel.getStudentsByMarker(modul);

      const worksheetData = [
        ["Sl.No", "Email ID", "Student Name", "Markers"],
        ...students.map((student) => [
          student.slNo,
          student.emailId,
          student.studentName,
          student.markers.join(", "),
        ]),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, `${modul} Only`);
    }

    // Create sheet for students with multiple markers
    const multipleMarkerStudents =
      await StudentModel.getStudentsWithMultipleMarkers();
    const multipleMarkersData = [
      ["Sl.No", "Email ID", "Student Name", "Markers"],
      ...multipleMarkerStudents.map((student) => [
        student.slNo,
        student.emailId,
        student.studentName,
        student.markers.join(", "),
      ]),
    ];

    const multipleMarkersSheet = XLSX.utils.aoa_to_sheet(multipleMarkersData);
    XLSX.utils.book_append_sheet(
      workbook,
      multipleMarkersSheet,
      "Multiple Markers"
    );

    // Generate buffer
    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Create response
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="students_report_${
          new Date().toISOString().split("T")[0]
        }.xlsx"`,
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Expires: "0",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
