"use client"
import { useState, useEffect } from "react"
import { Plus, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import AddStudentModal from "./AddStudentModal"
import EditStudentModal from "./EditStudentModal"
import { apiService } from "../../../services/apiServices"

const StudentSegment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [studentDetails, setStudentDetails] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleStudentAdded = () => {
    console.log("Student added, refreshing list...")
    getStudentDetail()
  }

  const handleStudentUpdated = () => {
    console.log("Student updated, refreshing list...")
    getStudentDetail()
  }

  const getStudentDetail = async () => {
    try {
      const response = await apiService.getStudentsDetails()
      console.log("Response from getStudentsDetails:", response)
      if (response) {
        setStudentDetails(response)
        setFilteredStudents(response)
      }
    } catch (error) {
      console.error("Error fetching student details:", error)
    }
  }

  const handleEditStudent = (student) => {
    setSelectedStudent(student)
    setIsEditModalOpen(true)
  }

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await apiService.deleteUserDetails(studentId)
        console.log("Student deleted successfully")
        getStudentDetail()
      } catch (error) {
        console.error("Error deleting student:", error)
        alert("Failed to delete student. Please try again.")
      }
    }
  }

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (term === "") {
      setFilteredStudents(studentDetails)
    } else {
      const filtered = studentDetails.filter((student) => {
        const fullName = `${student?.profile?.firstName || ""} ${student?.profile?.lastName || ""}`.toLowerCase()
        const username = student.username.toLowerCase()
        const email = student.email.toLowerCase()
        const phone = student?.profile?.phone || ""
        const address = student?.profile?.address || ""
        const classInfo = student?.profile?.class || ""
        const section = student?.profile?.section || ""

        return (
          fullName.includes(term) ||
          username.includes(term) ||
          email.includes(term) ||
          phone.includes(term) ||
          address.toLowerCase().includes(term) ||
          classInfo.toLowerCase().includes(term) ||
          section.toLowerCase().includes(term)
        )
      })
      setFilteredStudents(filtered)
    }
  }

  useEffect(() => {
    getStudentDetail()
  }, [])

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Students</h1>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input placeholder="Search students..." value={searchTerm} onChange={handleSearch} className="w-full" />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-green-500 hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredStudents && filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <Card key={student._id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {student?.profile?.firstName && student?.profile?.lastName
                        ? `${student.profile.firstName[0]}${student.profile.lastName[0]}`
                        : student.username.substring(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">{student.username}</h3>
                      <p className="text-gray-600 mb-1">
                        <strong>Name:</strong>{" "}
                        {student?.profile?.firstName && student?.profile?.lastName
                          ? `${student.profile.firstName} ${student.profile.lastName}`
                          : "Not provided"}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <strong>Email:</strong> {student.email}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <strong>Phone:</strong> {student?.profile?.phone || "Not provided"}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <strong>Address:</strong> {student?.profile?.address || "Not provided"}
                      </p>
                      {student?.profile?.class && student?.profile?.section && (
                        <p className="text-gray-600 mb-1">
                          <strong>Class:</strong> Grade {student.profile.class} - Section {student.profile.section}
                        </p>
                      )}
                      {student?.profile?.dateOfBirth && (
                        <p className="text-gray-600">
                          <strong>Date of Birth:</strong> {new Date(student.profile.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEditStudent(student)}
                      className="border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteStudent(student._id)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : searchTerm ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg mb-4">No students found for "{searchTerm}"</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilteredStudents(studentDetails)
              }}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No students available</p>
          </div>
        )}
      </div>

      <AddStudentModal open={isModalOpen} onOpenChange={setIsModalOpen} onStudentAdded={handleStudentAdded} />

      <EditStudentModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        student={selectedStudent}
        onStudentUpdated={handleStudentUpdated}
      />
    </div>
  )
}

export default StudentSegment
