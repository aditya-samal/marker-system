import "./globals.css";

export const metadata = {
  title: "Student Management System",
  description: "Manage student markers across different modules",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
