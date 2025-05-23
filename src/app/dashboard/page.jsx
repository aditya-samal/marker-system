"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const moduleColors = {
  App: "bg-blue-100 text-blue-800",
  Web: "bg-green-100 text-green-800",
  ML: "bg-purple-100 text-purple-800",
  Cyber: "bg-red-100 text-red-800",
  Design: "bg-pink-100 text-pink-800",
  CP: "bg-yellow-100 text-yellow-800",
};

export default function Dashboard() {
  const [userModule, setUserModule] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const modul = sessionStorage.getItem("userModule");
    if (!modul) {
      router.push("/");
      return;
    }
    setUserModule(modul);
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("marker", userModule);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(
          `Upload successful!\nCreated: ${result.results.created}\nUpdated: ${result.results.updated}\nErrors: ${result.results.errors.length}`
        );
        fetchStudents();
      } else {
        alert("Upload failed: " + result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploadLoading(false);
      event.target.value = "";
    }
  };

  const handleRemoveMarker = async (email) => {
    if (!confirm("Are you sure you want to remove this marker?")) return;

    try {
      const response = await fetch(
        `/api/students?email=${email}&marker=${userModule}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchStudents();
      } else {
        alert("Failed to remove marker");
      }
    } catch (error) {
      console.error("Error removing marker:", error);
      alert("Failed to remove marker");
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const response = await fetch("/api/export");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `students_report_${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed");
    } finally {
      setExportLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userModule");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {userModule} Dashboard
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${moduleColors[userModule]}`}
              >
                {userModule} modul
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Switch modul
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Upload CSV File</h2>
          <div className="flex items-center space-x-4">
            <label className="block">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploadLoading}
              />
            </label>
            {uploadLoading && <div className="text-blue-600">Uploading...</div>}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            CSV should have columns: IITG Email ID, Student Name
          </p>
        </div>

        {/* Export Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Export Data</h2>
              <p className="text-sm text-gray-500">
                Download Excel report with all student data
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={exportLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {exportLoading ? "Exporting..." : "Export Excel"}
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">
              All Students ({students.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sl.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Markers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.slNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.emailId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {student.markers.map((marker) => (
                          <span
                            key={marker}
                            className={`px-2 py-1 text-xs font-medium rounded-full ${moduleColors[marker]}`}
                          >
                            {marker}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.markers.includes(userModule) && (
                        <button
                          onClick={() => handleRemoveMarker(student.emailId)}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Remove {userModule}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {students.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No students found. Upload a CSV file to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
