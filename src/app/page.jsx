"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const modules = [
  { id: "App", name: "App Development", color: "bg-blue-500" },
  { id: "Web", name: "Web Development", color: "bg-green-500" },
  { id: "ML", name: "Machine Learning", color: "bg-purple-500" },
  { id: "Cyber", name: "Cyber Security", color: "bg-red-500" },
  { id: "Design", name: "Design", color: "bg-pink-500" },
  { id: "CP", name: "Competitive Programming", color: "bg-yellow-500" },
];

export default function LoginPage() {
  const [selectedModule, setSelectedModule] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (selectedModule) {
      sessionStorage.setItem("userModule", selectedModule);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Student Management System
          </h1>
          <p className="text-gray-600">Select your module to continue</p>
        </div>

        <div className="space-y-3 mb-8">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setSelectedModule(module.id)}
              className={`w-full p-4 rounded-lg text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                selectedModule === module.id
                  ? `${module.color} ring-4 ring-opacity-50 ring-offset-2`
                  : `${module.color} opacity-80 hover:opacity-100`
              }`}
            >
              {module.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleLogin}
          disabled={!selectedModule}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            selectedModule
              ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}
