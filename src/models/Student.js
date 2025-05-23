import clientPromise from "../lib/mongodb";

export class StudentModel {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db("student_management");
    return db.collection("students");
  }

  static async getAllStudents() {
    try {
      const collection = await this.getCollection();
      const students = await collection.find({}).sort({ slNo: 1 }).toArray();
      return students;
    } catch (error) {
      console.error("Error fetching students:", error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const collection = await this.getCollection();
      return await collection.findOne({ emailId: email });
    } catch (error) {
      console.error("Error finding student by email:", error);
      throw error;
    }
  }

  static async addStudent(studentData) {
    try {
      const collection = await this.getCollection();

      // Get the next sequence number
      const lastStudent = await collection.findOne({}, { sort: { slNo: -1 } });
      const nextSlNo = lastStudent ? lastStudent.slNo + 1 : 1;

      const newStudent = {
        slNo: nextSlNo,
        emailId: studentData.emailId,
        studentName: studentData.studentName,
        markers: [studentData.marker],
      };

      const result = await collection.insertOne(newStudent);
      return result;
    } catch (error) {
      console.error("Error adding student:", error);
      throw error;
    }
  }

  static async addMarker(email, marker) {
    try {
      const collection = await this.getCollection();
      const result = await collection.updateOne(
        { emailId: email },
        { $addToSet: { markers: marker } } // $addToSet prevents duplicates
      );
      return result;
    } catch (error) {
      console.error("Error adding marker:", error);
      throw error;
    }
  }

  static async removeMarker(email, marker) {
    try {
      const collection = await this.getCollection();
      const result = await collection.updateOne(
        { emailId: email },
        { $pull: { markers: marker } }
      );
      return result;
    } catch (error) {
      console.error("Error removing marker:", error);
      throw error;
    }
  }

  static async getStudentsByMarker(marker) {
    try {
      const collection = await this.getCollection();
      return await collection
        .find({
          markers: marker,
          $expr: { $eq: [{ $size: "$markers" }, 1] }, // Only students with single marker
        })
        .sort({ slNo: 1 })
        .toArray();
    } catch (error) {
      console.error("Error fetching students by marker:", error);
      throw error;
    }
  }

  static async getStudentsWithMultipleMarkers() {
    try {
      const collection = await this.getCollection();
      return await collection
        .find({
          $expr: { $gt: [{ $size: "$markers" }, 1] }, // Students with more than one marker
        })
        .sort({ slNo: 1 })
        .toArray();
    } catch (error) {
      console.error("Error fetching students with multiple markers:", error);
      throw error;
    }
  }
}
