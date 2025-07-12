import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies (for JWT in cookies)
  headers: {
    "Content-Type": "application/json",
  },
});

class ApiService {
  async request(config) {
    try {
      const response = await axiosInstance(config);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "An error occurred";
      throw new Error(message);
    }
  }

  // Auth endpoints
  login(email, password) {
    return this.request({
      url: "/auth/login",
      method: "POST",
      data: { email, password },
    });
  }

  register(userData) {
    return this.request({
      url: "/auth/register",
      method: "POST",
      data: userData,
    });
  }

  logout() {
    return this.request({
      url: "/auth/logout",
      method: "POST",
    });
  }

  checkAuth() {
    return this.request({
      url: "/auth/check",
      method: "GET",
    });
  }

  // Admin endpoints
  getAllStats() {
    return this.request({
      url: "/auth/allStats",
      method: "GET",
    });
  }

  getStudentsDetails() {
    return this.request({
      url: "/auth/getStudent",
      method: "GET",
    });
  }

  // Class endpoints
  getClasses() {
    return this.request({
      url: "/classes",
      method: "GET",
    });
  }

  createClass(classData) {
    return this.request({
      url: "/classes/create",
      method: "POST",
      data: classData,
    });
  }

  createOnlyClass(classData) {
    return this.request({
      url: "/classes/onlyclass",
      method: "POST",
      data: classData,
    });
  }

  updateClass(id, classData) {
    return this.request({
      url: `/classes/${id}`,
      method: "PUT",
      data: classData,
    });
  }

  deleteClass(id) {
    return this.request({
      url: `/classes/${id}`,
      method: "DELETE",
    });
  }

  // Student endpoints
  getStudentDashboard() {
    return this.request({
      url: "/student",
      method: "GET",
    });
  }

  updateStudentProfile(id, profileData) {
    return this.request({
      url: `/student/update/${id}`,
      method: "PUT",
      data: profileData,
    });
  }

  deleteStudentProfile(id) {
    return this.request({
      url: `/student/delete/${id}`,
      method: "DELETE",
    });
  }

  // Teacher endpoints
  getTeacherDashboard() {
    return this.request({
      url: "/teacher",
      method: "GET",
    });
  }

  getAssignedClasses(teacherId) {
    return this.request({
      url: `/classes/teacher-stats/${teacherId}`,
      method: "GET",
    });
  }

  getAssignedClassesStudent(studentId) {
    return this.request({
      url: `/classes/student-stats/${studentId}`,
      method: "GET",
    });
  }

  async getClassesWithQuizzes(studentId) {
    return this.request({
      url: `/classes/student/classes-with-quizzes/${studentId}`, // Adjust based on your backend route
      method: "GET",
    });
  }

  async getMCQwithClasses(teacherId) {
    return this.request({
      url: `classes/teacher/classes-with-mcqs/${teacherId}`,
      method: "GET",
    });
  }

  updateTeacherProfile(id, profileData) {
    return this.request({
      url: `/teacher/update/${id}`,
      method: "PUT",
      data: profileData,
    });
  }

  deleteTeacherProfile(id) {
    return this.request({
      url: `/teacher/delete/${id}`,
      method: "DELETE",
    });
  }

  getMyAssignedWithSubmissions() {
    return this.request({
      url: "/assignment/my-assigned-with-submissions",
      method: "GET",
    });
  }
  // New method for students to get their assignments
  getStudentAssignments() {
    return this.request({
      url: "/assignment/student/my-assignments",
      method: "GET",
    });
  }
  // New method for students to submit an assignment
  submitAssignment(assignmentId, submissionText) {
    return this.request({
      url: `/assignment/student/submit-assignment/${assignmentId}`,
      method: "POST",
      data: { submissionText },
    });
  }
  deleteAssignedAssignment(assignmentID) {
    return this.request({
      url: `/assignment/my-assigned/${assignmentID}`,
      method: "DELETE",
    });
  }

  // Debugged updateAssignedAssignment method
  updateAssignedAssignment(assignmentId, updatedData) {
    // `updatedData` must be passed as a parameter to the function
    return this.request({
      url: `/assignment/my-assigned/${assignmentId}`,
      data: updatedData, // Pass the `updatedData` object as the `data` property
      method: "PUT",
    });
  }

  getMyAssignments() {
    return this.request({
      url: "assignment/my-assigned",
      method: "GET",
    });
  }

  // Assignment endpoints
  getAssignments() {
    return this.request({
      url: "assignment/allassignment",
      method: "GET",
    });
  }
  getAssignmentSubmissions(assignmentId) {
    return this.request({
      url: `assignment/${assignmentId}/submissions`,
      method: "GET",
    });
  }
  // getAssignmentsForClass(classId) {
  //   return this.request({
  //     url: `/assignments/class/${classId}`,
  //     method: "GET",
  //   });
  // }

  createAssignment(assignmentData) {
    return this.request({
      url: "/assignment/create",
      method: "POST",
      data: assignmentData,
    });
  }
}

export const apiService = new ApiService();
