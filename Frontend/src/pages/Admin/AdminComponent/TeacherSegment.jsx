"use client"
import { useEffect, useState } from "react"
import { Plus, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import TeacherModal from "./TeacherModal"
import EditTeacherModal from "./EditTeacherModal"
import { apiService } from "../../../services/apiServices"

const TeacherSegment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [teacherDetails, setTeacherDetails] = useState([])
  const [filteredTeachers, setFilteredTeachers] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleStudentAdded = () => {
    console.log("Teacher added, refreshing list...")
    getTeacherDetails()
  }

  const handleTeacherUpdated = () => {
    console.log("Teacher updated, refreshing list...")
    getTeacherDetails()
  }

  const getTeacherDetails = async () => {
    try {
      const response = await apiService.getTeacherDetails()
      console.log("Response from getTeacherDetails:", response)
      if (response) {
        setTeacherDetails(response)
        setFilteredTeachers(response)
      }
    } catch (error) {
      console.error("Error fetching teacher details:", error)
    }
  }

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher)
    setIsEditModalOpen(true)
  }

  const handleDeleteTeacher = async (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await apiService.deleteUserDetails(teacherId)
        console.log("Teacher deleted successfully")
        getTeacherDetails()
      } catch (error) {
        console.error("Error deleting teacher:", error)
        alert("Failed to delete teacher. Please try again.")
      }
    }
  }

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (term === "") {
      setFilteredTeachers(teacherDetails)
    } else {
      const filtered = teacherDetails.filter((teacher) => {
        const fullName = `${teacher?.profile?.firstName || ""} ${teacher?.profile?.lastName || ""}`.toLowerCase()
        const username = teacher.username.toLowerCase()
        const email = teacher.email.toLowerCase()
        const phone = teacher?.profile?.phone || ""
        const address = teacher?.profile?.address || ""
        const classInfo = teacher?.profile?.class || ""
        const section = teacher?.profile?.section || ""

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
      setFilteredTeachers(filtered)
    }
  }

  useEffect(() => {
    getTeacherDetails()
  }, [])

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Teachers</h1>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input placeholder="Search teachers..." value={searchTerm} onChange={handleSearch} className="w-full" />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTeachers && filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <Card key={teacher?.profile._id || teacher._id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {teacher?.profile?.firstName && teacher?.profile?.lastName
                        ? `${teacher.profile.firstName[0]}${teacher.profile.lastName[0]}`
                        : teacher.username.substring(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">{teacher.username}</h3>
                      <p className="text-gray-600 mb-1">
                        <strong>Name:</strong>{" "}
                        {teacher?.profile?.firstName && teacher?.profile?.lastName
                          ? `${teacher.profile.firstName} ${teacher.profile.lastName}`
                          : "Not provided"}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <strong>Email:</strong> {teacher.email}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <strong>Phone:</strong> {teacher?.profile?.phone || "Not provided"}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <strong>Address:</strong> {teacher?.profile?.address || "Not provided"}
                      </p>
                      {teacher?.profile?.class && teacher?.profile?.section && (
                        <p className="text-gray-600">
                          <strong>Assigned Class:</strong> Grade {teacher.profile.class} - Section{" "}
                          {teacher.profile.section}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEditTeacher(teacher)}
                      className="border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteTeacher(teacher._id)}
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
            <p className="text-gray-500 text-lg mb-4">No teachers found for "{searchTerm}"</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilteredTeachers(teacherDetails)
              }}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No teachers available</p>
          </div>
        )}
      </div>

      <TeacherModal open={isModalOpen} onOpenChange={setIsModalOpen} onStudentAdded={handleStudentAdded} />

      <EditTeacherModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        teacher={selectedTeacher}
        onTeacherUpdated={handleTeacherUpdated}
      />
    </div>
  )
}

export default TeacherSegment
