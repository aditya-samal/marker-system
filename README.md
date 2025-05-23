# Student Management System

A Next.js application for managing student markers across different modules (App, Web, ML, Cyber, Design, CP).

## Features

- 6 different module login options (no authentication required)
- CSV file upload for each module
- Automatic student record management (create new or update existing)
- Remove markers functionality (module-specific)
- Excel export with 7 sheets:
  - 6 sheets for single-marker students (one per module)
  - 1 sheet for students with multiple markers

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up MongoDB Atlas

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/student_management?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, and `<cluster-url>` with your actual MongoDB Atlas credentials.

### 4. Run the Application

```bash
npm run dev
```

The application will be available at http://localhost:3000

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── export/
│   │   │   └── route.js
│   │   ├── students/
│   │   │   └── route.js
│   │   └── upload/
│   │       └── route.js
│   ├── dashboard/
│   │   └── page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── lib/
│   └── mongodb.js
└── models/
    └── Student.js
```

## Usage

### 1. Module Selection

- Access the application at the root URL
- Select your module (App, Web, ML, Cyber, Design, CP)
- Click "Continue to Dashboard"

### 2. CSV Upload

- Prepare a CSV file with columns: "IITG Email ID", "Student Name"
- Use the upload section in the dashboard
- The system will automatically:
  - Create new student records if email doesn't exist
  - Add your module marker to existing students

### 3. Manage Students

- View all students in the table
- Remove your module's marker from students (only your module)
- See all markers for each student with color-coded badges

### 4. Export Data

- Click "Export Excel" to download a comprehensive report
- The Excel file contains 7 sheets:
  - One sheet per module showing students with only that marker
  - One sheet showing students with multiple markers

## CSV Format

Your CSV file should have the following format:

```csv
IITG Email ID,Student Name
student1@iitg.ac.in,John Doe
student2@iitg.ac.in,Jane Smith
```

## Database Schema

The system uses a single MongoDB collection `students` with the following structure:

```javascript
{
  slNo: Number,           // Auto-incremental serial number
  emailId: String,        // Student's IITG email ID
  studentName: String,    // Student's full name
  markers: [String]       // Array of module markers (App, Web, ML, etc.)
}
```

## API Endpoints

- `POST /api/upload` - Upload CSV file and process student data
- `GET /api/students` - Fetch all students
- `DELETE /api/students` - Remove marker from student
- `GET /api/export` - Export Excel report

## Technologies Used

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **File Processing**: CSV parsing, Excel generation (XLSX)
- **Styling**: Tailwind CSS with custom color schemes

## Notes

- No authentication system - users select their module on login
- Session storage is used to maintain module selection
- Duplicate markers are automatically prevented
- Serial numbers are auto-assigned for new students
- Excel export includes all students organized by marker combinations
